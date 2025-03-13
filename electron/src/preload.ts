import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("secureStorage", {
  saveToken: (email: string, token: string) =>
    ipcRenderer.invoke("secureStorage:saveToken", email, token),
  getToken: (email: string) =>
    ipcRenderer.invoke("secureStorage:getToken", email),
  removeToken: (email: string) =>
    ipcRenderer.invoke("secureStorage:removeToken", email),
  getAllEmails: () => ipcRenderer.invoke("secureStorage:getAllEmails"),
});

// ✅ Expose API functions
contextBridge.exposeInMainWorld("api", {
  getAppVersion: () => require("../package.json").version,
  onUpdateAvailable: (callback: (version: string) => void) => {
    ipcRenderer.on("update-available", (_event, version) => callback(version));
  },
});
