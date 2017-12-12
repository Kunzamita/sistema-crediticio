// librerias
const ipcRenderer = require('electron').ipcRenderer;
const remote = require('electron').remote;
const mysql = require ('mysql');

var _id = remote.getGlobal('variables').user;

// informacion para conectar a la base de datos
const admin = mysql.createConnection({
    host: 'db4free.net',
    port: 3307,
    user: 'admindeoro',
    password: 'rootroot',
    database: 'arcijael'
});

// efecto esconder de la barra lateral
$('.dropdown-button').dropdown({
    inDuration: 300,
    outDuration: 225,
    constrainWidth: false, // Does not change width of dropdown to that of the activator
    hover: true, // Activate on hover
    gutter: 0, // Spacing from edge
    belowOrigin: true, // Displays dropdown below the button
    alignment: 'right', // Displays dropdown with edge aligned to the left of button
    stopPropagation: false // Stops event propagation
  }
);

// poner datos en barra lateral
admin.query('SELECT nombre, apellidoPat, correo FROM miembro WHERE id = ?', [_id], function (error, resultado, campos) {
    document.getElementById('usuario').innerHTML = resultado[0].nombre + " " + resultado[0].apellidoPat;
    document.getElementById('correo').innerHTML = resultado[0].correo;
    document.getElementById('foto').src = "../../fotos/" + _id + ".jpg";
});