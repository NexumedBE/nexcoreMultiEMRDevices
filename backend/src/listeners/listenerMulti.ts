import chokidar, { FSWatcher } from "chokidar";
import path from "path";
import fs from "fs";
import { debounce } from "lodash";
import { parseHL7 } from "../parsers/hl7Parser";
import { parseXML } from "../parsers/xmlParser";
import { parseGDT } from "../parsers/gdtParser";
import { saveGDTFile, jsonToGDT } from "../fileConverters/GDTGenerator";
import { saveAsJSON } from "../utils/saveAsJSON";
import { generateKMEHR } from "../fileConverters/KMEHRGenerators";
import { setListenersActive } from "../routes/checkListeners";
import { startBaxterListener } from "../listeners/baxterListener"; // ✅ Import HL7 Listener

const baseCPath = "C:\\Nexumed";
const nexumedInFolder = path.join(baseCPath, "nexumedIn");
const inFromDeviceFolder = path.join(baseCPath, "inFromDevice");

// Ensure required directories exist
[nexumedInFolder, inFromDeviceFolder].forEach((folder) => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
    console.log(`Created folder at: ${folder}`);
  }
});

// File Watchers
let watchers: FSWatcher[] = [];
let mesiWatcher: FSWatcher | null = null;
let hl7Active = false; // Track HL7 listener state

export const startWatchers = (user: any) => {
  console.log("🔥 [startWatchers] Checking user's setup...");

  // ✅ Prevent duplicate watchers
  if (watchers.length > 0 || mesiWatcher || hl7Active) {
    console.log("⚠️ [startWatchers] Listeners are already running. Skipping...");
    return;
  }

  const emr = user?.emrProviders?.[0]?.name || "Unknown EMR";
  const devices = user?.selectedDevices || [];

  console.log(`🚀 [startWatchers] User's EMR: ${emr}`);
  console.log(`🔍 [startWatchers] Devices:`, devices.map(d => d.device));

  let startedWatchers = 0;
  const totalWatchers = devices.length + 1; // Count EMR as a separate watcher

  const markWatcherReady = () => {
    startedWatchers++;
    console.log(`✅ [startWatchers] Watcher initialized: ${startedWatchers}/${totalWatchers}`);
    if (startedWatchers === totalWatchers) {
      setListenersActive(true);
      console.log("💯 [startWatchers] All listeners have started.");
    }
  };

  // 📁 **EMR-Based Watchers**
  if (emr === "CareConnect") {
    console.log("📝 Starting XML Watcher for CareConnect...");
    const xmlWatcher = chokidar.watch(inFromDeviceFolder, { persistent: true, ignored: [/parsedxml|\.json$/i] });

    xmlWatcher.on("ready", markWatcherReady);
    xmlWatcher.on("add", (filePath) => {
      console.log(`[startWatchers] New XML file detected: ${filePath}`);
      debouncedProcessFile(filePath, "inFromDevice");
    });
    
    watchers.push(xmlWatcher);
  } 
  else if (emr === "Sandy") {
    console.log("🔜 FHIR Listener for Sandy EMR coming soon...");
    // Future implementation for FHIR listener
    markWatcherReady();
  }

  // 🏥 **Device-Based Watchers**
  devices.forEach((device) => {
    if (device.manufacturer === "MESI") {
      console.log("📡 Starting MESI GDT Watcher...");
      mesiWatcher = chokidar.watch("C:\\MESI services\\MESI mTABLET GDT Integration Service\\Output", {
        persistent: true,
        ignored: /mTABLET\.IntegrationService\.GDT\.WaitForResult\.exe$/,
      });

      mesiWatcher.on("ready", markWatcherReady);
      mesiWatcher.on("add", (filePath) => {
        console.log(`📄 New GDT file detected: ${filePath}`);
        const destinationPath = path.join(inFromDeviceFolder, path.basename(filePath));
        fs.copyFile(filePath, destinationPath, (err) => {
          if (err) console.error(`❌ Error copying file to inFromDevice:`, err);
          else {
            console.log(`✅ File copied to inFromDevice: ${destinationPath}`);
            debouncedProcessFile(destinationPath, "inFromDevice");
          }
        });
      });
    } 
    else if (device.manufacturer === "Baxter" && !hl7Active) {
      console.log("⚡ Starting HL7 Listener for Baxter...");
      startHL7Listener();
      hl7Active = true;
      markWatcherReady();
    }
  });

  console.log("✅ [startWatchers] Listeners have been successfully started.");
};

export const stopWatchers = () => {
  console.log("⛔ Stopping file listeners...");
  watchers.forEach((watcher) => watcher.close());
  if (mesiWatcher) mesiWatcher.close();
  watchers = [];
  mesiWatcher = null;
  setListenersActive(false);
  console.log("✅ Listeners stopped.");
};

// Debounce file processing to avoid duplicate processing
const debouncedProcessFile = debounce((filePath: string, source: string) => {
  processFile(filePath, source);
}, 100);

// Process file based on extension
function processFile(filePath: string, source: string) {
  console.log(`[processFile] Processing file: ${filePath} from source: ${source}`);

  if (processedFiles.has(filePath)) {
    console.warn(`[processFile] File already processed: ${filePath}`);
    return;
  }
  processedFiles.add(filePath);

  const fileExtension = path.extname(filePath).toLowerCase();

  switch (fileExtension) {
    case ".hl7":
      console.log(`[processFile] Detected HL7 file: ${filePath}`);
      parseHL7(filePath, (hl7FilePath, parsedMessage) => {
        saveAsJSON(hl7FilePath, parsedMessage, `parsedhl7-${source}`);
      });
      break;

    case ".xml":
      console.log(`[processFile] Detected XML file: ${filePath}`);
      fs.readFile(filePath, "utf8", (err, data) => {
        if (err) return console.error(`[processFile] Error reading XML file: ${filePath}`, err);
        parseXML(data, (parsedMessage) => {
          saveAsJSON(filePath, parsedMessage, `parsedxml-${source}`);
          if (source === "nexumedIn") {
            saveGDTFile(filePath, jsonToGDT(parsedMessage));
          }
        });
      });
      break;

    case ".gdt":
      console.log(`[processFile] Detected GDT file: ${filePath}`);
      fs.readFile(filePath, "utf8", (err, data) => {
        if (err) return console.error(`[processFile] Error reading GDT file: ${filePath}`, err);
        const parsedMessage = parseGDT(data);
        saveAsJSON(filePath, parsedMessage, `parsedgdt-${source}`);
      });
      break;

    default:
      console.warn(`[processFile] Unknown file format: ${fileExtension}`);
  }
}

generateKMEHR();
