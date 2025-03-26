import chokidar from "chokidar";
import { debouncedProcessFile } from "../utils/watcherUtils";

 

export const startCareConnectListener = (user: any) => {
  console.log("📡 Starting CareConnect Listener...");

  // ✅ Dynamically determine which folder to watch
  let inputFolder = "";
  const devices: { manufacturer: string }[] = user?.selectedDevices || [];

  if (devices.some((device) => device.manufacturer === "MESI")) {
    inputFolder = "C:\\Nexumed\\inFromDevice\\kmehr-xml-output"; 
    console.log(`🟢 [CareConnect] Watching KMEHR XML Output folder: ${inputFolder}`);
  } else if (devices.some((device) => device.manufacturer === "BAXTER")) {
    inputFolder = "C:\\Nexumed\\baxter";
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
    debouncedProcessFile(filePath, "inputFolder", "CareConnect", "r");
  });

  console.log("✅ CareConnect Listener started.");
};

