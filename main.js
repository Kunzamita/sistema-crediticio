// librerias basicas
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipcMain = electron.ipcMain;

// detecta si esta en modo desarrollo
const isDev = require('electron-is-dev');

// variables globales
global.variables = {
    user: 'test'
};

app.on('ready', function () {
    // crea la ventana principal
    var mainWindow = new BrowserWindow({
        width: 320,
        height: 480,
        minWidth: 320,
        minHeight: 480,
        title: "ARCIJAEL",
        show:false
    });
    //mainWindow.setMenu(null);
    mainWindow.loadURL('file://' + __dirname + '/index.html');
    
    // muestra ventana principal
    mainWindow.once('ready-to-show', function(){
        mainWindow.show();
    });

    // capta cambio de ventana
    ipcMain.on('abrir-busca-asociados', function () {
        mainWindow.loadURL('file://' + __dirname + '/app/windows/busca.asociados/busca.asociados.html');
    });

    // muestra la ventana de depuracion
    if (isDev) {
        mainWindow.openDevTools({detach: true});
    }
});

app.on('window-all-closed', function(){
    app.quit();
});