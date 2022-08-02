const { app, ipcMain, BrowserWindow } = require('electron')
const path = require('path')
const appData = app.getPath('userData')
const saveFile = path.join(appData,'save.json')
const fs = require('fs')

function createWindow () {
  const win = new BrowserWindow({
    minWidth: 560,
    minHeight: 510,
    width: 800,
    height: 600,
    fullscreenable: true,
    fullscreen: (process.platform == 'darwin'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  win.maximize()
  win.loadFile('src/render/main/index.html')
}

function checkSave () {
  if (!(fs.existsSync(saveFile))) {
    fs.appendFile(saveFile, JSON.stringify({cardPacks:[]}), (err) => {if (err) console.log(err)})
  }
}

app.whenReady().then(() => {
  checkSave()
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  app.quit();
})