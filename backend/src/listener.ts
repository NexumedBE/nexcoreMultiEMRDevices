import chokidar, { FSWatcher } from 'chokidar';
import path from 'path';
import os from 'os';
import fs from 'fs';
import { debounce } from 'lodash';
import { parseHL7 } from './parsers/hl7Parser';
import { parseXML } from './parsers/xmlParser';
import { parseGDT } from './parsers/gdtParser';
import { saveGDTFile, jsonToGDT } from './fileConverters/GDTGenerator';
import { saveAsJSON } from './utils/saveAsJSON';
import { generateKMEHR } from './fileConverters/KMEHRGenerators';
import { setListenersActive } from './routes/checkListeners';


const baseCPath = 'C:\\Nexumed';
const nexumedInFolder = path.join(baseCPath, 'nexumedIn');
const inFromDeviceFolder = path.join(baseCPath, 'inFromDevice');
const mesiOutputFolder = 'C:\\MESI services\\MESI mTABLET GDT Integration Service\\Output';
const outputFolder = 'C:\\MESI services\\MESI mTABLET GDT Integration Service\\Input';

// Ensure required directories exist
if (!fs.existsSync(baseCPath)) {
  fs.mkdirSync(baseCPath, { recursive: true });
  console.log(`Created base directory ${baseCPath}`);
}

[nexumedInFolder, inFromDeviceFolder, mesiOutputFolder, outputFolder].forEach((folder) => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
    console.log(`Created folder at: ${folder}`);
  }
});

// console.log(`Backend started successfully.`);

// File Watchers
let watchers: FSWatcher[] = [];
let mesiWatcher: FSWatcher | null = null;

export const startWatchers = () => {
  console.log("🔥 [startWatchers] Called - Checking if listeners should start...");

  // ✅ Prevent duplicate watchers
  if (watchers.length > 0 || mesiWatcher) {
    console.log("⚠️ [startWatchers] Listeners are already running. Skipping...");
    return;
  }

  console.log("🚀 [startWatchers] Starting file listeners...");

  let startedWatchers = 0;
  const totalWatchers = 3;

  const markWatcherReady = () => {
    startedWatchers++;
    console.log(`✅ [startWatchers] Watcher initialized: ${startedWatchers}/${totalWatchers}`);
    if (startedWatchers === totalWatchers) {
      setListenersActive(true);
      console.log("💯 [startWatchers] All listeners have started.");
    }
  };

  watchers = [
    chokidar.watch(nexumedInFolder, {
      persistent: true,
      ignored: [/parsedhl7|parsedxml|parsedgdt|\.json$/i],
    }),
    chokidar.watch(inFromDeviceFolder, {
      persistent: true,
      ignored: [/parsedhl7|parsedxml|parsedgdt|\.json$/i],
    }),
  ];

  watchers.forEach((watcher, index) => {
    const folderName = index === 0 ? "nexumedIn" : "inFromDevice";
    
    watcher.on("ready", () => {
      console.log(`✅ [startWatchers] Watcher ready for ${folderName}`);
      markWatcherReady();
    });

    watcher.on("add", (filePath) => {
      console.log(`[startWatchers] New file detected in ${folderName}: ${filePath}`);
      debouncedProcessFile(filePath, folderName);
    });

    watcher.on("error", (error) => console.error(`❌ [startWatchers] Error in ${folderName}: ${error}`));
  });

  // ✅ Ensure MESI watcher is properly initialized
  mesiWatcher = chokidar.watch(mesiOutputFolder, {
    persistent: true,
    ignored: /mTABLET\.IntegrationService\.GDT\.WaitForResult\.exe$/,
  });

  mesiWatcher.on("ready", () => {
    console.log(`🎅 [startWatchers] MESI watcher initialized.`);
    markWatcherReady();
  });

  mesiWatcher.on("add", (filePath) => {
    console.log(`📄 New GDT file detected in MESI Output: ${filePath}`);
    if (path.extname(filePath).toLowerCase() === ".gdt") {
      const destinationPath = path.join(inFromDeviceFolder, path.basename(filePath));
      fs.copyFile(filePath, destinationPath, (err) => {
        if (err) {
          console.error(`❌ Error copying file to inFromDevice:`, err);
        } else {
          console.log(`✅ File copied to inFromDevice: ${destinationPath}`);
          debouncedProcessFile(destinationPath, "inFromDevice");
        }
      });
    }
  });

  console.log("✅ [startWatchers] Listeners have been successfully started.");
};



export const stopWatchers = () => {
  console.log("Stopping file listeners...");
  watchers.forEach((watcher) => watcher.close());
  if (mesiWatcher) {
    mesiWatcher.close();
  }
  watchers = [];
  mesiWatcher = null; 
  setListenersActive(false);
  console.log("Listeners stopped.");
};


// Debounce file processing to avoid duplicate processing
const debouncedProcessFile = debounce((filePath: string, source: string) => {
  processFile(filePath, source);
}, 100);

// Processed files tracking
export const processedFiles = new Set<string>();

function processFile(filePath: string, source: string) {
  console.log(`[processFile] Start processing file: ${filePath} from source: ${source}`);

  if (processedFiles.has(filePath)) {
    console.warn(`[processFile] File already processed: ${filePath}`);
    return;
  }
  processedFiles.add(filePath);

  const fileExtension = path.extname(filePath).toLowerCase();

  if (filePath.startsWith(outputFolder)) {
    console.log(`[processFile] Ignoring file from output folder: ${filePath}`);
    return;
  }

  switch (fileExtension) {
    case '.hl7':
      console.log(`[processFile] Detected .hl7 file: ${filePath}`);
      parseHL7(filePath, (hl7FilePath, parsedMessage) => {
        saveAsJSON(hl7FilePath, parsedMessage, `parsedhl7-${source}`);
      });
      break;

    case '.xml':
      console.log(`[processFile] Detected .xml file: ${filePath}`);
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          console.error(`[processFile] Error reading XML file: ${filePath}`, err);
          return;
        }

        parseXML(data, (parsedMessage) => {
          saveAsJSON(filePath, parsedMessage, `parsedxml-${source}`);
          const parsedJsonPath = path.join(
            path.dirname(filePath),
            `parsedxml-${source}`,
            `${path.basename(filePath, path.extname(filePath))}.json`
          );

          fs.readFile(parsedJsonPath, 'utf8', (err, jsonData) => {
            if (err) {
              console.error(`[processFile] Error reading JSON file: ${parsedJsonPath}`, err);
              return;
            }

            const parsedJson = JSON.parse(jsonData);
            const gdtContent = jsonToGDT(parsedJson);

            if (source === 'nexumedIn') {
              saveGDTFile(filePath, gdtContent);
            } else {
              console.warn(`[processFile] Skipping saveGDTFile for XML from ${source}`);
            }
          });
        });
      });
      break;

    case '.gdt':
      console.log(`[processFile] Detected .gdt file: ${filePath}`);
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          console.error(`[processFile] Error reading GDT file: ${filePath}`, err);
          return;
        }

        const parsedMessage = parseGDT(data);
        saveAsJSON(filePath, parsedMessage, `parsedgdt-${source}`);
        console.log(`[processFile] JSON saved for .gdt file: ${filePath}`);
      });
      break;

    default:
      console.warn(`[processFile] Unknown file format from: ${source}: ${fileExtension}`);
  }
}

generateKMEHR();