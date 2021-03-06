// librerias
const ipcRenderer = require('electron').ipcRenderer;
const remote = require('electron').remote;
const mysql = require ('mysql');

// informacion para conectar a la base de datos
const admin = mysql.createConnection({
    host: 'db4free.net',
    port: 3307,
    user: 'admindeoro',
    password: 'rootroot',
    database: 'arcijael'
});

// conectamos a la base de datos
admin.connect(function(err){
    if (err){
        console.log(err.code);
        console.log(err.fatal);
    }
});


// lo que hace el boton entrar
function botonEntrar(){
    // obtiene el usuario y clave ingresados
    let _usuario = document.getElementById('usuario').value;
    let _clave = document.getElementById('clave').value;

    // obtiene el usuario y clave de la base de datos
    admin.query('SELECT id,clave FROM usuarioAdmin WHERE usuario = ?', [_usuario], function (error, resultado, campos) {
        if (resultado.length > 0){
            //los compara
            if (resultado[0].clave == _clave){     
                remote.getGlobal('variables').user = resultado[0].id;           
                ipcRenderer.send('abrir-busca-asociados');
            }
        } else {
            console.log("NO EXISTES WEY");
        }
    });
};