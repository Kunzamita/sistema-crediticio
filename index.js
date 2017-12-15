///////////////////////////////
// LIBRERIAS //////////////////
///////////////////////////////

const ipcRenderer = require('electron').ipcRenderer;
const remote = require('electron').remote;
const mysql = require ('mysql');

///////////////////////////////
// VARIABLES //////////////////
///////////////////////////////
var _id = 'test';

///////////////////////////////
// SQL/////////////////////////
///////////////////////////////

const admin = mysql.createConnection({
    host: 'db4free.net',
    port: 3307,
    user: 'admindeoro',
    password: 'rootroot',
    database: 'arcijael'
});

admin.connect(function(err){
    if (err){
        console.log(err.code);
        console.log(err.fatal);
    }
});

///////////////////////////////
// VENTANAS ///////////////////
///////////////////////////////

function esconderTodo(){

    $("main").removeAttr("class");
    $("main").removeAttr("style");

    $("footer").removeAttr("class");
    $("footer").removeAttr("style");

    $("header").children().hide();
    $("main").children().hide();
    $("footer").children().hide();
}

function mostrarLogo(){
    esconderTodo();
    $("#logo-main").show();
    $("#logo-footer").show();

    $("main").attr("class", "col s12 valign-wrapper");
    $("main").attr("style", "height: 80%");

    $("footer").attr("class", "col s12 valign-wrapper");
    $("footer").attr("style", "height: 20%");
}

function mostrarLogin(){
    esconderTodo();
    $("#login-header").show();
    $("#login-main").show();
}

function mostrarPersonas(){
    esconderTodo();
    $("#personas-header").show();
    $("#personas-main").show();
    rellenaSide();
    muestraPersonas();
}

///////////////////////////////
// LOAD /////////////////
///////////////////////////////

$(document).ready(function(){
    //inicializar elementos
    $(".button-collapse").sideNav({
        menuWidth: 250,
    });

    mostrarLogo();
    
    // temporizador
    setTimeout(function() {
        mostrarLogin();  /// importante!
    }, 1000);
});

///////////////////////////////
// LOGIN //////////////////////
///////////////////////////////

function botonEntrar(){
    // obtiene el usuario y clave ingresados
    let _usuario = document.getElementById('usuario').value;
    let _clave = document.getElementById('clave').value;

    // obtiene el usuario y clave de la base de datos
    admin.query("SELECT id,clave FROM usuarioAdmin WHERE usuario = ?", [_usuario], function (error, resultado, campos) {
        if (resultado.length > 0){
            //los compara
            if (resultado[0].clave == _clave){;
                _id = resultado[0].id;
                mostrarPersonas();
                return;
            }
        } else {
        }
    });
};

///////////////////////////////
// PERSONAS ///////////////////
///////////////////////////////

function rellenaSide(){
    admin.query('SELECT nombre, apellidoPat, correo FROM usuarioAdmin WHERE id = ?', [_id], function (error, resultado, campos) {
        $('#fotoPersonas')[0].src = "app/fotos/" + _id + ".jpg";
        $('#nombrePersonas')[0].innerHTML = resultado[0].nombre + " " + resultado[0].apellidoPat;
        $('#correoPersonas')[0].innerHTML = resultado[0].correo;
    });
};

function muestraPersona(numero){
    admin.query('SELECT tipoAsociado, apellidoPat, apellidoMat, nombres,dni FROM persona WHERE id = ?', [numero], function (error, resultado, campos) {
        let fila = document.getElementById('tablaPersonas').getElementsByTagName('tbody')[0].insertRow(-1);

        let celdaTipo = fila.insertCell(0);
        let celdaDatos = fila.insertCell(1);

        let color = "red";
        switch (resultado[0].tipoAsociado){
            case 'A': 
                color="blue";
                break;
            case 'C':
                color = "lime";
                break;
            case 'O':
                color= "green";
                break;
            case 'E':
                color = "grey";
        }

        celdaTipo.innerHTML = "<span class='white-text'>+</span>"+
            "<a class='btn-floating "+color+"'><div class='center' style='font-size: 16px;'>"+resultado[0].tipoAsociado+
            "</div></a>";
        celdaDatos.innerHTML = "<p style='font-weight: bold; font-size: 14px;'>"+resultado[0].apellidoPat+" "+
            resultado[0].apellidoMat+" "+resultado[0].nombres+"</p>"+
            "<p style='font-size: 12px;'>"+resultado[0].dni+"</p>";
    });
}

function muestraPersonas(){
    for(i=1;i<=10;i++){
        muestraPersona(i);
    }
}