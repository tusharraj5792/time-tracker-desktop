
# Time Tracker Desktop

A Time Tracker Desktop App is used for checking the employee work status by taking screenshot of entire screen after several time and store's employee today total work hours    



## Run Locally

Clone the project

```bash
  git clone https://github.com/tusharraj5792/time-tracker-desktop.git
```

Go to the project directory

```bash
  cd time-tracker-desktop
```

Install dependencies

```bash
# If you use npm
  npm install
```

```bash
# Or if you use yarn
  yarn install
```

Start the server

```bash
# If you use npm
  npm start
```

```bash
# Or if you use yarn
  yarn start
```
## How To Create Build

To create build of appliction you need to run following :

->For 64 bits
```bash
# If you use npm
  npm run buildx64
```
```bash
# Or if you use yarn
  yarn run buildx64
```

->For 34 bits
```bash
# If you use npm
  npm run buildx86
```
```bash
# Or if you use yarn
  yarn run buildx86
```


## How to create installer
For create installer of your app you need to download Wix toolset (https://github.com/wixtoolset/wix3/releases/tag/wix3112rtm)
```bash
# You need to add your build path in build.js file and change some line of code
```
```bash
  const APP_DIR = path.resolve(__dirname, "./path_to_build_directory")
```
```bash
# For 32 bits
   const OUT_DIR = path.resolve(__dirname,"./TimeTracker 1.0.1 windows_installer_x86"
   arch: "x86",
);
```

```bash
# For 64 bits
   const OUT_DIR = path.resolve(__dirname,"./TimeTracker 1.0.1 windows_installer_x64"
   arch: "x64",
);
```
```bash
# Run 
    node build.js 
```

After few time the installer of your is created and you can simple install it.


## Tech Stack

**Client:** Vite With React Application,Typescript,Electron js,Axios,React Router Dom,React Hook Form,Bootstrap,SASS

**Server:** ASP.Net

