const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("ai", {
  json: (apiKey, prompt) => ipcRenderer.invoke("ai:json", { apiKey, prompt })
});
