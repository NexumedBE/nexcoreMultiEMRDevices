import chokidar, { FSWatcher } from "chokidar";
import path from "path";
import fs from "fs";
import { debouncedProcessFile } from "../utils/watcherUtils"; 
import { setListenersActive } from "../routes/checkListeners";

const baseCPath = "C:\\Nexumed";
const nexumedInFolder = path.join(baseCPath, "nexumedIn");
const inFromDeviceFolder = path.join(baseCPath, "inFromDevice");
const mesiOutputFolder = "C:\\MESI services\\MESI mTABLET GDT Integration Service\\Output";

// Ensure required directories exist
[nexumedInFolder, inFromDeviceFolder, mesiOutputFolder].forEach((folder) => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
    console.log(`Created folder at: ${folder}`);
  }
});

// File Watchers
let watchers: FSWatcher[] = [];
let mesiWatcher: FSWatcher | null = null;

export const startMESIListener = (emr:string) => {
  console.log("🔥 [startMESIListener] Checking if listeners should start...");

  // ✅ Prevent duplicate watchers
  if (watchers.length > 0 || mesiWatcher) {
    console.log("⚠️ [startMESIListener] MESI Listeners are already running. Skipping...");
    return;
  }

  console.log("🚀 [startMESIListener] Starting MESI file listeners...");

  let startedWatchers = 0;
  const totalWatchers = 2; // Only necessary watchers

  const markWatcherReady = () => {
    startedWatchers++;
    console.log(`✅ [startMESIListener] Watcher initialized: ${startedWatchers}/${totalWatchers}`);
    if (startedWatchers === totalWatchers) {
      setListenersActive(true);
      console.log("💯 [startMESIListener] All MESI listeners have started.");
    }
  };

  watchers = [
    chokidar.watch(nexumedInFolder, {
      persistent: true,
      ignored: [/parsedhl7|parsedxml|parsedgdt|parsedJSON-.*/i],
    }),
  ];

  watchers.forEach((watcher) => {
    watcher.on("ready", () => {
      console.log(`✅ [startMESIListener] Watcher ready for nexumedIn`);
      markWatcherReady();
    });

    watcher.on("add", (filePath) => {
      console.log(`[startMESIListener] New file detected in nexumedIn: ${filePath}`);
      debouncedProcessFile(filePath, "nexumedIn", "MESI", emr);
    });

    watcher.on("error", (error) => console.error(`❌ [startMESIListener] Error in nexumedIn: ${error}`));
  });

  // ✅ MESI Output Watcher
  mesiWatcher = chokidar.watch(mesiOutputFolder, {
    persistent: true,
    ignored: [
      "**/parsedgdt-mesiOutput/**", // Ignore all contents within parsedgdt-mesiOutput
      /parsedgdt-mesiOutput/, // Ignore the folder itself
      /\.exe$/, // Ignore executables
    ],
  });

  mesiWatcher.on("ready", () => {
    console.log(`🎅 [startMESIListener] MESI watcher initialized.`);
    markWatcherReady();
  });

  mesiWatcher.on("add", (filePath) => {
    console.log(`📄 New GDT file detected in MESI Output: ${filePath}`);
    debouncedProcessFile(filePath, "mesiOutput", "MESI", emr);
  });

  console.log("✅ [startMESIListener] Listeners have been successfully started.");
};
