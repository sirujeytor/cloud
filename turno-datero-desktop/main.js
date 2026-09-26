const { app, BrowserWindow, ipcMain, Tray, Menu, shell, nativeImage } = require("electron");
const path = require("path");
const https = require("https");

let mainWindow = null;
let tray = null;
let isQuitting = false;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 440,
    height: 820,
    minWidth: 380,
    minHeight: 560,
    title: "Turno Datero",
    autoHideMenuBar: true,
    icon: path.join(__dirname, "assets", "icon.ico"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });
  mainWindow.setMenuBarVisibility(false);
  mainWindow.loadFile(path.join(__dirname, "renderer", "index.html"));

  // Any link the page opens (WhatsApp links, external URLs) goes to the
  // user's real browser instead of a new Electron window.
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  // Closing the window hides it to the tray instead of quitting, so the
  // app keeps watching leads and can still show notifications in the
  // background. "Salir" from the tray menu is the real quit.
  mainWindow.on("close", (event) => {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });
}

function createTray() {
  const icon = nativeImage.createFromPath(path.join(__dirname, "assets", "icon-32.png"));
  tray = new Tray(icon);
  tray.setToolTip("Turno Datero");
  const menu = Menu.buildFromTemplate([
    {
      label: "Abrir Turno Datero",
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        }
      }
    },
    { type: "separator" },
    {
      label: "Salir",
      click: () => {
        isQuitting = true;
        app.quit();
      }
    }
  ]);
  tray.setContextMenu(menu);
  tray.on("click", () => {
    if (!mainWindow) return;
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });
}

app.whenReady().then(() => {
  if (process.platform === "win32") {
    app.setAppUserModelId("com.turnodatero.app");
  }
  createWindow();
  createTray();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    } else if (mainWindow) {
      mainWindow.show();
    }
  });
});

app.on("before-quit", () => {
  isQuitting = true;
});

function deepseekChat(apiKey, prompt, wantJson) {
  return new Promise((resolve, reject) => {
    const payload = {
      model: "deepseek-chat",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    };
    if (wantJson) payload.response_format = { type: "json_object" };
    const body = JSON.stringify(payload);

    const req = https.request(
      {
        hostname: "api.deepseek.com",
        path: "/chat/completions",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body),
          Authorization: "Bearer " + apiKey
        },
        timeout: 60000
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          if (res.statusCode < 200 || res.statusCode >= 300) {
            let msg = "Error HTTP " + res.statusCode + " de DeepSeek.";
            try {
              const parsed = JSON.parse(data);
              if (parsed.error && parsed.error.message) msg = parsed.error.message;
            } catch (e) {
              /* keep default msg */
            }
            reject(new Error(msg));
            return;
          }
          try {
            const parsed = JSON.parse(data);
            const content =
              parsed.choices &&
              parsed.choices[0] &&
              parsed.choices[0].message &&
              parsed.choices[0].message.content;
            if (!content) {
              reject(new Error("DeepSeek devolvió una respuesta vacía."));
              return;
            }
            resolve(content);
          } catch (e) {
            reject(new Error("No se pudo leer la respuesta de DeepSeek."));
          }
        });
      }
    );
    req.on("timeout", () => {
      req.destroy(new Error("Se agotó el tiempo de espera hablando con DeepSeek."));
    });
    req.on("error", (err) => reject(err));
    req.write(body);
    req.end();
  });
}

ipcMain.handle("ai:json", async (_event, { apiKey, prompt }) => {
  if (!apiKey || !apiKey.trim()) {
    throw new Error("Falta la API key de DeepSeek.");
  }
  return deepseekChat(apiKey.trim(), prompt, true);
});
