import chokidar from "chokidar";
import fs from "fs";
import path from "path";
import { debounce } from "lodash";
import { parseGDT } from "../parsers/gdtParser";
import { parseHL7 } from "../parsers/hl7Parser";
import { saveAsJSON } from "../utils/saveAsJSON";
import { generateKMEHR } from "../fileConverters/KMEHRGenerators";

const kmehrOutputFolder = "C:\\Nexumed\\inFromDevice\\output-to-cc"; //Final processed KMEHR XML output

export const startCareConnectListener = (user: any) => {
  console.log("📡 Starting CareConnect Listener...");

  // ✅ Dynamically determine which folder to watch
  let inputFolder = "";
  const devices = user?.selectedDevices || [];

  if (devices.some((device) => device.manufacturer === "MESI")) {
    inputFolder = "C:\\MESI services\\MESI mTABLET GDT Integration Service\\Output";
    console.log(`🟢 [CareConnect] Watching MESI Output folder: ${inputFolder}`);
  } else if (devices.some((device) => device.manufacturer === "Baxter")) {
    inputFolder = "C:\\Nexumed\\baxter"; // Baxter HL7 output folder
    console.log(`🟢 [CareConnect] Watching Baxter HL7 folder: ${inputFolder}`);
  } else {
    console.warn("❌ [CareConnect] No compatible device found for processing.");
    return;
  }

  // Watch the chosen folder for incoming files
  const watcher = chokidar.watch(inputFolder, {
    persistent: true,
    ignored: [/parsedgdt|parsedhl7|\.json$/i],
  });

  watcher.on("ready", () => {
    console.log("✅ CareConnect Listener initialized.");
  });

  watcher.on("add", (filePath) => {
    console.log(`[CareConnect] 📥 New file detected: ${filePath}`);
    debouncedProcessFile(filePath);
  });

  console.log("✅ CareConnect Listener started.");
};

// Debounce processing to avoid duplicate parsing
const debouncedProcessFile = debounce((filePath: string) => {
  processFile(filePath);
}, 100);

// 🔵 Process incoming files (GDT or HL7)
function processFile(filePath: string) {
  console.log(`[CareConnect] 🛠️ Processing file: ${filePath}`);

  const fileExtension = path.extname(filePath).toLowerCase();

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) return console.error(`[CareConnect] ❌ Error reading file: ${filePath}`, err);

    switch (fileExtension) {
      case ".gdt":
        console.log(`[CareConnect] 🔄 Converting GDT to KMEHR XML...`);
        const parsedGDT = parseGDT(data);
        saveAsJSON(filePath, parsedGDT, "parsedgdt");
        generateKMEHR(kmehrOutputFolder);
        console.log(`[CareConnect] ✅ KMEHR XML saved to: ${kmehrOutputFolder}`);
        break;

      case ".hl7":
        console.log(`[CareConnect] 🔄 Converting HL7 to KMEHR XML...`);
        parseHL7(filePath, (hl7FilePath, parsedHL7) => {
          saveAsJSON(hl7FilePath, parsedHL7, "parsedhl7");
          generateKMEHR(kmehrOutputFolder);
          console.log(`[CareConnect] ✅ KMEHR XML saved to: ${kmehrOutputFolder}`);
        });
        break;

      default:
        console.warn(`[CareConnect] ❌ Unsupported file format: ${fileExtension}`);
    }
  });
}
