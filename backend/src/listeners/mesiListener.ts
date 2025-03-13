import chokidar from "chokidar";
import path from "path";
import fs from "fs";
import { debounce } from "lodash";
import { parseGDT } from "../parsers/gdtParser";
import { saveAsJSON } from "../utils/saveAsJSON";
import { jsonToGDT, saveGDTFile } from "../fileConverters/GDTGenerator";
import { parseXML } from "../parsers/xmlParser";
import { parseHL7 } from "../parsers/hl7Parser";

const baseCPath = "C:\\Nexumed";
const nexumedInFolder = path.join(baseCPath, "nexumedIn"); //Files dropped by any EMR
const infromEMR = "C:\\MESI services\\MESI mTABLET GDT Integration Service\\Input"; //MESI Input folder

export const startMESIListener = () => {
  console.log("📡 Starting MESI GDT Listener...");

  // Watch for files in `nexumedIn`
  const watcher = chokidar.watch(nexumedInFolder, {
    persistent: true,
    ignored: [/parsedhl7|parsedxml|parsedgdt|\.json$/i],
  });

  watcher.on("ready", () => console.log("✅ MESI Listener initialized."));

  watcher.on("add", (filePath) => {
    console.log(`📥 [MESI] New file detected in nexumedIn: ${filePath}`);
    debouncedProcessFile(filePath);
  });

  console.log("✅ MESI Listener started.");
};

// Debounce processing to avoid duplicate processing
const debouncedProcessFile = debounce((filePath: string) => {
  processFile(filePath);
}, 100);

// Process incoming files and convert to GDT
function processFile(filePath: string) {
  console.log(`[MESI] Processing file: ${filePath}`);

  const fileExtension = path.extname(filePath).toLowerCase();

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(`[MESI] ❌ Error reading file: ${filePath}`, err);
      return;
    }

    let parsedMessage;

    switch (fileExtension) {
      case ".xml":
        console.log(`[MESI] 🔄 Converting XML to GDT...`);
        parseXML(data, (parsedXML) => {
          saveAsJSON(filePath, parsedXML, "parsedxml");
          convertToGDTAndSend(parsedXML, filePath);
        });
        break;

      case ".hl7":
        console.log(`[MESI] 🔄 Converting HL7 to GDT...`);
        parseHL7(filePath, (hl7FilePath, parsedHL7) => {
          saveAsJSON(hl7FilePath, parsedHL7, "parsedhl7");
          convertToGDTAndSend(parsedHL7, filePath);
        });
        break;

      default:
        console.warn(`[MESI] ❌ Unsupported file format: ${fileExtension}`);
    }
  });
}

// Convert parsed data to GDT and send it to MESI
function convertToGDTAndSend(parsedData: any, originalFilePath: string) {
  const gdtContent = jsonToGDT(parsedData);
  const gdtFilename = path.basename(originalFilePath, path.extname(originalFilePath)) + ".gdt";
  const gdtFilePath = path.join(infromEMR, gdtFilename);

  saveGDTFile(gdtFilePath, gdtContent);
  console.log(`✅ [MESI] GDT file saved to: ${gdtFilePath}`);
}
