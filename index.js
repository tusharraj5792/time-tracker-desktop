const {
  app,
  BrowserWindow,
  systemPreferences,
  screen,
  ipcMain,
  dialog,
  Menu,
  Tray,
  desktopCapturer,
  globalShortcut,
} = require("electron");
const isOnline = require("is-online");
const path = require("path");

let tray, trayWin, newWinWidth, userIdleTime;
function createWindow() {
  const win = new BrowserWindow({
    center: true,
    frame: false,
    transparent: true,
    width: 350,
    height: 580,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
      nativeWindowOpen: true,
    },
    autoHideMenuBar: true,
    resizable: false,
  });

  let isSingleInstance = app.requestSingleInstanceLock();
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  if (!isSingleInstance) {
    app.quit();
  } else {
    app.on("second-instance", (event, commandLine, workingDirectory) => {
      // Someone tried to run a second instance, we should focus our window.
      if (!win.isVisible()) {
        showWindow();
      }
      if (win) {
        if (win.isMinimized()) win.restore();
        win.focus();
      }
    });
  }
  trayWin = win;
  // win.webContents.openDevTools();
  win.loadFile("index.html");
  // win.loadURL("http://localhost:3000/");
  win.loadURL("https://time-tracker-ensuesoft.vercel.app/")

  win.webContents.on(
    "new-window",
    (event, url, frameName, disposition, options, additionalFeatures) => {
      if (frameName === "screenshotCaptured") {
        event.preventDefault();
        Object.assign(options, {
          frame: false,
          transparent: false,
          webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false,
            nativeWindowOpen: true,
          },
          alwaysOnTop: true,
          minimizable: false,
          resizable: false,
        });
        event.newGuest = new BrowserWindow(options);
        event.newGuest.setSkipTaskbar(true);
      } else if (frameName === "selectTaskWindow") {
        event.preventDefault();
        Object.assign(options, {
          frame: false,
          transparent: false,
          webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false,
            nativeWindowOpen: true,
          },
          alwaysOnTop: true,
          minimizable: false,
          resizable: false,
        });
        event.newGuest = new BrowserWindow(options);
        // event.newGuest.setContentProtection(true);
        event.newGuest.setSkipTaskbar(true);
      }
    }
  );

  isOnline().then((online) => {
    if (online) {
      console.log("We have internet");
    } else {
      dialog
        .showMessageBox(null, {
          buttons: ["&Retry", "&Quit"],
          type: "warning",
          title: "Warning",
          message: "You don't have internet connection",
        })
        .then((result) => {
          if (result.response === 0) {
            app.relaunch();
            app.quit();
          } else if (result.response === 1) {
            win.close();
          }
        });
    }
  });

  ipcMain.on("screenshot:capture", (e, value) => {
    desktopCapturer
      .getSources({
        types: ["screen"],
        thumbnailSize: {
          width: 1920,
          height: 1080,
        },
      })
      .then((sources) => {
        // console.log(sources[0].thumbnail.toPNG());
        let image = sources[0].thumbnail.toDataURL();
        win.webContents.send("screenshot:captured", {
          image: image,
          taskId: value.taskId,
          projectId: value.projectId,
        });
      });
  });
  ipcMain.on("minimizeWindow", (e, value) => {
    win.minimize();
  });
  ipcMain.on("closeWindow", (e, value) => {
    app.quit();
  });
}

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

function showWindow() {
  let display = screen.getPrimaryDisplay();
  const mySize = display.size;
  //console.log(display, "display");
  trayWin.setPosition(mySize.width - newWinWidth, 0, false);
  trayWin.show();
  trayWin.setVisibleOnAllWorkspaces(true);
  trayWin.focus();
  trayWin.setVisibleOnAllWorkspaces(false);
}

app.whenReady().then(() => {
  createWindow();
  tray = new Tray(path.join(__dirname, "assets/img/logo.png"));
  tray.setIgnoreDoubleClickEvents(true);

  tray.on("click", function () {
    if (trayWin.isVisible()) {
      trayWin.hide();
    } else {
      showWindow();
    }
  });
  tray.on("right-click", function () {
    const menu = [
      {
        role: "quit",
        accelerator: "Command+Q",
      },
    ];
    tray.popUpContextMenu(Menu.buildFromTemplate(menu));
  });

  let cameraAccess = systemPreferences.getMediaAccessStatus("camera");
  let microphoneAccess = systemPreferences.getMediaAccessStatus("microphone");

  if (cameraAccess != "granted") {
    console.log("aksing for camera");
    systemPreferences
      .askForMediaAccess("camera")
      .then((allowed) => console.log("Camera is allowed"));
  }
  if (microphoneAccess != "granted") {
    console.log("aksing for camera");
    systemPreferences
      .askForMediaAccess("microphone")
      .then((allowed) => console.log("Camera is allowed"));
  }

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  app.on("browser-window-focus", function () {
    globalShortcut.unregister("CommandOrControl+R");
    globalShortcut.unregister("F5");
  });

  app.setLoginItemSettings({
    openAtLogin: true,
    path: process.execPath,
    args: [
      "--processStart",
      `"VirtualRoom"`,
      "--process-start-args",
      `"--hidden"`,
    ],
  });
});
