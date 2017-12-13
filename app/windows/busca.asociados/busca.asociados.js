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
$(".button-collapse").sideNav({
    edge: 'right'
});

$(document).ready(function(){
    $('.collapsible').collapsible();
  });

// poner datos en barra lateral
admin.query('SELECT nombre, apellidoPat, correo FROM miembro WHERE id = ?', [_id], function (error, resultado, campos) {
    document.getElementById('usuario').innerHTML = resultado[0].nombre + " " + resultado[0].apellidoPat;
    document.getElementById('correo').innerHTML = resultado[0].correo;
    document.getElementById('foto').src = "../../fotos/" + _id + ".jpg";
});

// obtiene la tabla
var tablaClientes = document.getElementById('tabla-clientes');

// crea las filas e inserta datos de clientes
admin.query('SELECT apellidoPat, apellidoMat, nombres, dni, asociadoNumero FROM cliente WHERE id >=1 AND id <=10', function (error, resultado, campos) {
    resultado.forEach(cliente => {
        //insertar nueva fila
        var fila = tablaClientes.insertRow(-1);

        //insertar celdas
        var celdaNombre = fila.insertCell(0);
        var celdaDni = fila.insertCell(1);
        var celdaCodigo = fila.insertCell(2);
        var celdaDescuento = fila.insertCell(3);
        var celdaBotones = fila.insertCell(4);

        //inserta datos
        celdaNombre.innerHTML = cliente.apellidoPat + " " + cliente.apellidoMat + " " + cliente.nombres;
        var dniExtendido = "00000000"+cliente.dni;
        celdaDni.innerHTML = dniExtendido.substr(dniExtendido.length-8);
        celdaCodigo.innerHTML = cliente.asociadoNumero
        celdaDescuento.innerHTML = "0";
        celdaBotones.innerHTML = "<span class='white-text'><i class='material-icons'>edit</i> <i class='material-icons'>attach_money</i> <i class='material-icons'>timeline</i></span>"
    });
});

$( "#tabla-contenedor" ).on("mouseover","#tabla-clientes tr", function(){
    var fila = tablaClientes.rows[$(this).context.rowIndex];

    if(fila.rowIndex == 0){
        return;
    };

    var celdaBotones = fila.cells[4];

    celdaBotones.innerHTML = "<i class='material-icons'>edit</i> <i class='material-icons'>attach_money</i> <i class='material-icons'>timeline</i>";
});

$( "#tabla-contenedor" ).on("mouseout","#tabla-clientes tr", function(){
    var fila = tablaClientes.rows[$(this).context.rowIndex];

    var celdaBotones = fila.cells[4];

    celdaBotones.innerHTML = "<span class='white-text'><i class='material-icons'>edit</i> <i class='material-icons'>attach_money</i> <i class='material-icons'>timeline</i></span>";
});

