import chokidar from "chokidar";
import { debouncedProcessFile } from "../utils/watcherUtils";


export const startSandyListener = (user: any) => {
  console.log("📡 Starting Sandy Listener...");

  // ✅ Define Sandy's input folder
  let inputFolder = "";
  const devices: { manufacturer: string }[] = user?.selectedDevices || [];

  if (devices.some((device) => device.manufacturer === "MESI")) {
    inputFolder = "C:\\MESI services\\MESI mTABLET GDT Integration Service\\Output";
    console.log(`🟢 [Sanday] Watching MESI Output folder: ${inputFolder}`);
  } else if (devices.some((device) => device.manufacturer === "BAXTER")) {
    inputFolder = "C:\\Nexumed\\baxter"; 
    console.log(`🟢 [Sanday] Watching Baxter HL7 folder: ${inputFolder}`);
  } else {
    console.warn("❌ [Sanday] No compatible device found for processing.");
    return;
  }

  // Watch for FHIR files (JSON)
  const watcher = chokidar.watch(inputFolder, {
    persistent: true,
    ignored: [/parsedfhir|\.log$/i], // Ignore already processed FHIR files
  });

  watcher.on("ready", () => {
    console.log("✅ Sandy Listener initialized.");
  });

  watcher.on("add", (filePath) => {
    console.log(`📥[Sandy] New FHIR file detected: ${filePath}`);
    debouncedProcessFile(filePath,"inputFolder", "Sanday", "ee");
  });

  console.log("✅ Sandy Listener started.");
};



