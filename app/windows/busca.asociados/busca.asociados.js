///////////////////////////////
// LIBRERIAS //////////////////
///////////////////////////////
const ipcRenderer = require('electron').ipcRenderer;
const remote = require('electron').remote;
const mysql = require ('mysql');

///////////////////////////////
// FUNCIONALIDAD //////////////
///////////////////////////////
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
    $('.modal').modal();
});

///////////////////////////////
// TABLA //////////////////////
///////////////////////////////  
// poner datos en barra lateral
admin.query('SELECT nombre, apellidoPat, correo FROM miembro WHERE id = ?', [_id], function (error, resultado, campos) {
    document.getElementById('usuario').innerHTML = resultado[0].nombre + " " + resultado[0].apellidoPat;
    document.getElementById('correo').innerHTML = resultado[0].correo;
    document.getElementById('foto').src = "../../fotos/" + _id + ".jpg";
});

// obtiene la tabla
var tablaClientes = document.getElementById('tabla-clientes').getElementsByTagName('tbody')[0];

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
        if (cliente.asociadoNumero != null){
            celdaCodigo.innerHTML = cliente.asociadoNumero;
        } else {
            celdaCodigo.innerHTML = "-";
        }
        celdaDescuento.innerHTML = "0";
        celdaBotones.innerHTML = "<span class='white-text'><i class='material-icons'>edit</i> <i class='material-icons'>attach_money</i> <i class='material-icons'>timeline</i></span>"
    });
});

// aparecen los botones cuando pasa el mouse
$( "#tabla-contenedor" ).on("mouseover","#tabla-clientes tr", function(){
    if($(this).context.rowIndex == 0){
        return;
    };

    var fila = tablaClientes.rows[$(this).context.rowIndex-1];

    var spanBotones = fila.cells[4].getElementsByTagName('span')[0];
    $(spanBotones).removeAttr("class");
});

// desaparecen cuando el mouse sale
$( "#tabla-contenedor" ).on("mouseout","#tabla-clientes tr", function(){
    if($(this).context.rowIndex == 0){
        return;
    };

    var fila = tablaClientes.rows[$(this).context.rowIndex-1];

    var spanBotones = fila.cells[4].getElementsByTagName('span')[0];

    $(spanBotones).attr("class", "white-text");
});

///////////////////////////////
// BOTONES DE CELDA ///////////
///////////////////////////////
$("#tabla-contenedor").on('click','i',function(){
    switch($(this).index()) {
        case 0:
            $('#modal-edicion').modal('open');
            break;
        case 1:
            break;
        default:
    }
});

///////////////////////////////
// PAGINACION /////////////////
///////////////////////////////
//funcion para insertar 10 filas
function insertaFilas (index) {
    var comienza = index * 10 - 9;

    //borra toda la tabla
    while(tablaClientes.hasChildNodes()){
        tablaClientes.removeChild(tablaClientes.firstChild);
    }

    admin.query('SELECT apellidoPat, apellidoMat, nombres, dni, asociadoNumero FROM cliente WHERE id >=? AND id <=?',[comienza, comienza + 9], function (error, resultado, campos) {
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
}

// controla la paginacion - me enrede haciendo esto
$("#tabla-contenedor").on("click","#paginacion li", function(){
    if($(this).text()=="chevron_left"){
        var index = $("#paginacion .active").text() - 0;
        if(index==1) return;
        $("#paginacion .active").removeClass().addClass("waves-effect");
        $("#paginacion li:nth-child("+ index +")").removeClass().addClass("active");
    } else if($(this).text()=="chevron_right"){
        var index = $("#paginacion .active").text() - 0 + 2;
        if(index == $("#paginacion li").length) return;
        $("#paginacion .active").removeClass().addClass("waves-effect");
        $("#paginacion li:nth-child("+ index +")").removeClass().addClass("active");
    } else {
        $("#paginacion .active").removeClass().addClass("waves-effect");
        $(this).removeClass().addClass("active");
    }

    //inserta las 10 filas correspondientes
    insertaFilas($("#paginacion .active").text()-0);
});
