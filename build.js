

// 1. Import Modules
const { MSICreator } = require("electron-wix-msi");
const path = require("path");

// 2. Define input and output directory.
// Important: the directories must be absolute, not relative e.g
const APP_DIR = path.resolve(__dirname, "./build/x86/TimeTracker-win32-ia32");
// outputDirectory: "C:\\Users\sdkca\Desktop\windows_installer",
const OUT_DIR = path.resolve(
  __dirname,
  "./TimeTracker 1.0.1 windows_installer_x86"
);

// 3. Instantiate the MSICreator
const msiCreator = new MSICreator({
  appDirectory: APP_DIR,
  outputDirectory: OUT_DIR,

  // Configure metadata
  exe: "TimeTracker",
  name: "TimeTracker",
  manufacturer: "EnsueSoft",
  version: "1.0.1",
  appIconPath: __dirname + "/assets/img/small-logo.ico",
  arch: "x86",
  // ui: {
  //   chooseDirectory: true,
  //   images: {
  //     background: __dirname + "/assets/img/background.png",
  //     banner: __dirname + "/assets/img/banner.png",
  //     exclamationIcon: __dirname + "/assets/img/info.png",
  //     infoIcon: __dirname + "/assets/img/info.png",
  //     newIcon: __dirname + "/assets/img/up-new.png",
  //     upIcon: __dirname + "/assets/img/up-new.png",
  //   },
  // },
});

// 4. Create a .wxs template file
msiCreator.create().then(function () {
  // Step 5: Compile the template to a .msi file
  msiCreator.compile();
});