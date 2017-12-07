const electron = require ('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require ('path');
const isDev = require('electron-is-dev');

app.on('ready', function () {
    var mainWindow = new BrowserWindow({
        width: 1080,
        height: 680,
        minWidth: 700,
        minHeight: 500
    });

    if (isDev) {
        mainWindow.openDevTools({detach: true});
    }

    mainWindow.loadURL(path.normalize('file://' + path.join(__dirname, 'index.html')));
    
    app.on('activate', function () {
        if (mainWindow) {
          mainWindow.show();
        }
        return false;
    });

    app.on('window-all-closed', function () {
        app.quit();
    });
});