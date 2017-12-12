// librerias basicas
const electron = require ('electron');
const BrowserWindow = electron.BrowserWindow;
const ipcMain = electron.ipcMain;

//libreria administradora de ventanas
const ventanaAdmin = require ('electron-windows-manager');

// detecta si esta en modo desarrollo
const isDev = require('electron-is-dev');

ventanaAdmin.init();

ipcMain.on('crear-ventana', crear)

function crear() {
    var ventana = new BrowserWindow({
        width: 1080,
        height: 680,
        minWidth: 700,
        minHeight: 500
    });
}
app.on('ready', function () {

    // crea ventana login
    var loginWindow = new BrowserWindow({
        width: 1080,
        height: 680,
        minWidth: 700,
        minHeight: 500
    });
    loginWindow.loadURL('file://' + __dirname + '/app/windows/login/login.html');

    // crea ventana busca asociados
    var asociadosWindow = new BrowserWindow({
        width: 1080,
        height: 680,
        minWidth: 700,
        minHeight: 500,
        show: false
    });
    asociadosWindow.loadURL('file://' + __dirname + '/app/windows/busca.asociados/busca.asociados.html');

    // capta cambio de ventana
    ipcMain.on('abrir-busca-asociados', function () {
        loginWindow.close();
        asociadosWindow.show();
    });

    // capta usuario
    ipcMain.on('id', function(event, arg){
        console.log(arg);
        asociadosWindow.webContents.send('id2', 'msg');
    });

    // muestra la ventana de depuracion
    if (isDev) {
        loginWindow.openDevTools({detach: true});
    }
});

app.on('window-all-closed', function(){
    console.log('hola');

    app.quit();
});