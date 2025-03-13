import AutoLaunch from 'electron-auto-launch';
import { fileURLToPath } from "url";
import fs from "fs-extra";
import path from "path";
import { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage } from "electron";
import { spawn, ChildProcess } from "child_process";
import os from "os";
import net from "net";
import nodeCron from "node-cron";
import keytar from "keytar";


let tray: Tray | null = null;
let mainWindow: BrowserWindow | null;
let backendProcess: ChildProcess | null = null;
let isQuitting = false; // 🔹 Track whether the app is quitting

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Detect environment
const isDev = process.env.NODE_ENV === "development";

// Determine Node.js path
const arch = os.arch();
const nodePath = isDev
  ? process.execPath
  : path.join(process.resourcesPath, "nodejs", arch === "x64" ? "x64/node.exe" : "x86/node.exe");

console.log(`Electron app starting in ${isDev ? "development" : "production"} mode...`);

// Prevent multiple instances
if (!app.requestSingleInstanceLock()) {
  console.log("Another instance detected, force quitting...");
  app.quit();
  process.exit(0);
} else {
  app.on("second-instance", () => {
    console.log("Second instance detected - ensuring only one is running.");
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    } else {
      app.quit();
    }
  });
}

// Logging setup
const logFilePath = path.join(app.getPath("userData"), "backend.log");
const logFileStream = fs.createWriteStream(logFilePath, { flags: "a" });

console.log = (...args) => {
  logFileStream.write(`[LOG] ${new Date().toISOString()} - ${args.join(" ")}\n`);
  process.stdout.write(`${args.join(" ")}\n`);
};

console.error = (...args) => {
  logFileStream.write(`[ERROR] ${new Date().toISOString()} - ${args.join(" ")}\n`);
  process.stderr.write(`${args.join(" ")}\n`);
};


const iconPath = path.resolve(__dirname, "icon.ico");
// Create the Electron window
const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
    autoHideMenuBar: true,
    icon: iconPath,
  });

  const frontendPath = isDev
    ? process.env.VITE_DEV_SERVER_URL!
    : path.join(process.resourcesPath, "frontend", "dist", "index.html");

  console.log("Resolved Frontend Path:", frontendPath);

  if (isDev) {
    mainWindow.loadURL(frontendPath);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(frontendPath).catch((err) => {
      console.error("Failed to load index.html:", err);
    });
  }

  mainWindow.on("close", (event) => {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow?.hide();
      console.log("🛑 Window minimized to tray...");
    }
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
};


async function checkForUpdates(retryCount = 3) {
  try {
    const packageJsonPath = path.join(__dirname, "..", "package.json");
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
    const installedVersion = packageJson.version;

    const response = await fetch("https://nexumed.eu/version.json");

    // Ensure valid response and content type
    if (!response.ok || !response.headers.get("content-type")?.includes("application/json")) {
      throw new Error("Failed to retrieve valid JSON or the API is down.");
    }

    const versions = await response.json();
    const latestVersion = versions.latestVersionFolder;

    // Send the latest version to the frontend
    if (installedVersion !== latestVersion) {
      console.log("🚀 New version available:", latestVersion);
      if (mainWindow) {
        mainWindow.webContents.send("update-available", latestVersion);  // Notify frontend
      }
    } else {
      console.log("✅ App is up to date.");
    }
  } catch (error) {
    console.error("⚠️ Failed to check for updates:", error);

    // If the API fails, retry a maximum of 3 times, but don't block the app
    if (retryCount > 0) {
      console.log("⏳ Retrying...");
      setTimeout(() => checkForUpdates(retryCount - 1), 5000);  // Non-blocking retry mechanism with a 5-second delay
    } else {
      console.log("❌ Max retries reached. Update check failed.");
    }
  }
}

// Schedule weekly update check (every Monday at 9 AM)
nodeCron.schedule("0 9 * * 1", () => {
  console.log("🔍 Weekly update check triggered...");
  checkForUpdates();  // Non-blocking weekly check
});

const getIconPath = () => {
  return isDev 
    ? path.join(__dirname, "icon.ico")  
    : path.join(process.resourcesPath, "icon.ico"); 
};

const setupTray = () => {
  const iconPath = getIconPath();
  if (!fs.existsSync(iconPath)) {
    console.error("❌ Tray icon not found:", iconPath);
  }

  tray = new Tray(nativeImage.createFromPath(iconPath));
  tray.setToolTip("Nexcore is running in the background");

  const contextMenu = Menu.buildFromTemplate([
    { label: "Open Nexcore", click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        } else {
          createWindow();
        }
      }},
    { label: "Quit", click: () => {
        isQuitting = true;
        app.quit();
      }},
  ]);

  tray.setContextMenu(contextMenu);
};


// Run the initial update check at startup
app.whenReady().then(() => {
  console.log("✅ Electron app started");

  // 🔹 Ensure Nexcore Auto-Launch on System Startup
  const nexcoreAutoLauncher = new AutoLaunch({
    name: "Nexcore",
    path: app.getPath("exe"),
    isHidden: true, 
  });

  nexcoreAutoLauncher.isEnabled().then(async (isEnabled) => {
    if (!isEnabled) {
      try {
        console.log("🔄 Requesting elevated privileges for auto-launch...");
        await nexcoreAutoLauncher.enable();
        console.log("✅ Nexcore auto-launch enabled.");
      } catch (error) {
        console.error("❌ Failed to enable auto-launch. Try running as Administrator:", error);
      }
    }
  });


  const baseCPath = 'C:\\Nexumed';
  if (!fs.existsSync(baseCPath)) {
    fs.mkdirSync(baseCPath, { recursive: true });
  }

  const sourceFolder = path.join(process.resourcesPath, 'emrReciever');
  const destination = path.join(baseCPath, 'emrReciever');

  fs.copy(sourceFolder, destination)
    .then(() => console.log('✅ Care Connect folder copied to C:\\Nexumed\\emrReciever.'))
    .catch(err => console.error('❌ Error copying folder:', err));

  // 🔹 Register Secure Storage IPC Handlers
    ipcMain.handle("secureStorage:saveToken", async (_event, email, token) => {
      try {
        await keytar.setPassword("Nexcore", email, token);
        console.log(`✅ Token saved for ${email}`);
        return true;
      } catch (error) {
        console.error("❌ Error saving token:", error);
        return false;
      }
    });
  
    ipcMain.handle("secureStorage:getToken", async (_event, email) => {
      try {
        const token = await keytar.getPassword("Nexcore", email);
        console.log(`🔍 Retrieved token for ${email}:`, token);
        return token;
      } catch (error) {
        console.error("❌ Error retrieving token:", error);
        return null;
      }
    });
  
    ipcMain.handle("secureStorage:removeToken", async (_event, email) => {
      try {
        await keytar.deletePassword("Nexcore", email);
        console.log(`✅ Token removed for ${email}`);
        return true;
      } catch (error) {
        console.error("❌ Error removing token:", error);
        return false;
      }
    });

    ipcMain.handle("secureStorage:getAllEmails", async () => {
      try {
        const accounts = await keytar.findCredentials("Nexcore"); 
        return accounts.map(account => account.account); 
      } catch (error) {
        console.error("❌ Error retrieving stored emails:", error);
        return [];
      }
    });
    
  setupTray();
  // 🔹 Check for updates
  checkForUpdates();

  // 🔹 Start backend server
  startBackendServer();

  // 🔹 Finally, create the Electron window (UI)
  createWindow(); 
});


// Expose update notifications to frontend via IPC
ipcMain.on("request-update-check", () => {
  checkForUpdates();  // Allows manual update check via IPC
});


// Function to check if a port is in use
const isPortInUse = (port: number): Promise<boolean> => {
  return new Promise((resolve) => {
    const client = new net.Socket();

    client.once("connect", () => {
      console.log(`✅ Port ${port} is already in use. Backend is likely running.`);
      client.destroy();
      resolve(true);
    });

    client.once("error", (err: any) => {
      if (err.code === "ECONNREFUSED") {
        console.log(`🔴 Port ${port} is NOT in use. Backend is NOT running.`);
        resolve(false);
      } else {
        resolve(true);
      }
    });

    client.setTimeout(200); // Prevents long waits
    client.connect(port, "127.0.0.1");
  });
};

// Start the backend server
const checkBackendHealth = async () => {
  return new Promise<boolean>((resolve) => {
    const client = new net.Socket();
    client.once("connect", () => {
      console.log(`✅ Backend is running and responsive.`);
      client.destroy();
      resolve(true);
    });

    client.once("error", (err: any) => {
      if (err.code === "ECONNREFUSED") {
        console.log(`🔴 Backend port is open but not responsive. It might have crashed.`);
        resolve(false);
      } else {
        resolve(true);
      }
    });

    client.setTimeout(500);
    client.connect(2756, "127.0.0.1");
  });
};

const startBackendServer = async () => {
  console.log("Checking if backend is already running...");

  const portInUse = await isPortInUse(2756);
  if (portInUse || backendProcess) {
    console.log("🚀 Backend server is already running. Skipping startup.");
    return;
  }

  console.log("Starting backend process...");
  
  const backendPath = isDev
    ? path.join(__dirname, "../../backend/src/index.ts")
    : path.join(process.resourcesPath, "backend", "dist", "index.js");

  console.log("✅ Resolved Backend Path:", backendPath);

  if (!fs.existsSync(backendPath)) {
    console.error("❌ Backend server file does not exist:", backendPath);
    return;
  }

  console.log("Using Node.js Path:", nodePath);
  console.log("Attempting to start backend process...");

  const spawnArgs = isDev ? ["-r", "ts-node/register", backendPath] : [backendPath];

  backendProcess = spawn(nodePath, spawnArgs, {
    stdio: ["ignore", logFileStream , logFileStream ], 
    shell: false, // ✅ Prevents opening a terminal window
    detached: true, // ✅ Keeps backend running even if Electron closes
    windowsHide: true, // ✅ Hides the process from popping up
    cwd: isDev ? path.join(__dirname, "../../backend") : path.join(process.resourcesPath, "backend"),
    env: {
      MONGO_URI: "mongodb+srv://Admin:Nexumed6348906@userdata.luekt.mongodb.net/?retryWrites=true&w=majority&appName=UserDat",
      JWT_SECRET: "ice_hockey_is_simply_the_best_sport",
      SESSION_SECRET: "golf_is_a_close_second",
    },
  });
  

  backendProcess.stdout?.on("data", (data) => {
    console.log(`Backend stdout: ${data.toString()}`);
  });

  backendProcess.stderr?.on("data", (data) => {
    console.error(`Backend stderr: ${data.toString()}`);
  });

  backendProcess.on("exit", (code, signal) => {
    console.log(`Backend process exited with code: ${code}, signal: ${signal}`);
  });

  backendProcess.on("error", (error) => {
    console.error("❌ Failed to start backend process:", error);
  });

  backendProcess.unref(); 

  console.log("✅ Backend process successfully started.");
};


app.on("window-all-closed", () => {
  console.log("🛑 Window closed, minimizing to tray...");
});

app.on("quit", (event) => {
  if (!isQuitting) {
    console.log("🚀 Relaunching Nexcore after crash...");
    event.preventDefault();
    setTimeout(() => {
      app.relaunch();
      app.exit();
    }, 2000); 
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
