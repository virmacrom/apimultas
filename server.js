//const db = require ('./db.js');

var express = require('express');
var bodyParser = require('body-parser');

const Multa = require ('./multas');
const passport = require ('passport');

require('./passport.js');

var BASE_API_PATH = "/api/v1";

var app = express();
app.use(bodyParser.json());
app.use(passport.initialize());

app.get("/",(req,res)=>{
    res.send("<html><body><h1>My server multas</h1></body></html>")
});

app.get(BASE_API_PATH + "/multas", 
    passport.authenticate('localapikey', {session:false}),
    (req, res) =>{
    console.log(Date() + " - GET /multas");
   //ya no es db, ahora es Multa
    Multa.find({},(err, multas) =>{
        if(err){
            console.log(Date () + " - " + err);
            res.sendStatus(500);
        }else{
            res.send(multas.map((multa) => {
                return multa.cleanup();
                // delete multa._id;
                // return multa;
            }));
        }
    });
});

app.get(BASE_API_PATH + "/multas/:dni", 
    passport.authenticate('localapikey', {session:false}),
    (req, res) =>{
        var dni = req.params.dni;
          console.log(Date() + " - GET /multas/:dni");
          //ya no es db, ahora es Multa
          Multa.find({"dni":dni},(err,multas) =>{
           if(err){
            console.error("Error accesing DB");
            res.sendStatus(500);
          }else{
            res.send(multas[0].cleanup());
            if(multas.length>1) {
                console.warn("Incosistent DB: duplicated dni");
            }
        } 
    });
});

app.post(BASE_API_PATH + "/multas", (req, res) =>{
    console.log(Date() + " - POST /multas");
    var multa = req.body;

    /*VALIDACION DEL DNI*/
    
    var vector = ["T","R","W","A","G","M","Y","F","P","D","X","B","N","J","Z","S","Q","V","M","L","C","K","E"]
    var dniJunto = multa.getElementById("dni").value;
    var dniJuntoMayuscula = "";
    var comprobador = 0;
    var numerosDni = 0;
    var letra = "";
    var residuo;
    var contador = 0;
    var dniSeparado = dniJunto.split("");
 
      for(contador=0;contador<dniSeparado.length;cont++){
        //Los primeros 8 caracteres tienen que ser números
        if (contador <= 7) {
            if (isNaN(dniSeparado[contador])) {
                comprobador = 1;
                //DNI es un String y no un número
            }
        }else {  
            //comprobar que el noveno caracter del dni no es un número
            if (isNaN(dniSeparado[8])) {
                dniSeparado = dniSeparado[8].toUpperCase();
            } else {
                comprobador = 1;
 
            }
        }
    }
    //para comprobar que la longitud sea 9
    if(contador!=9){
      comprobador = 1;
        //faltan números o letra
    }else{
        dniJuntoMayuscula = dniSeparado.join("");
 
        //vamos a juntar los 8 numeros del dni
 
        numerosDni = dniJuntoMayuscula.substring(0, 8);
 
        //vamos a guardar la letra del DNI
 
        letra = dniJuntoMayuscula.substring(8, 9);
 
        residuo = numeroDni % 23;
 
        if (vector[residuo] != letra) {
            comprobador = 2;
 
        }
    } 
 
    if (comprobador==0){
        alert("El DNI es incorrecto");
    }else if(comprobador==1){
      alert("El DNI es incorrecto");
    }else if(comprobador==2){
        alert("Letra del DNI mal puesta");
    }
    
    /*FIN DE LA VALIDACION DEL DNI*/


    //ya no es db.insert, ahora es multa.create
    Multa.create(multa, (err) => {
        if (err){
            console.log (Date () + " - " + err);
            res.sendStatus(500);
        }else{
            res.sendStatus(201);
        }
    });
  //  multas.push(multa);
   // res.sendStatus(201);
});

app.put(BASE_API_PATH + "/multas/editar", (req, res) => {
    console.log(Date()+" - PUT /multas/editar");
    res.sendStatus(405);
});

app.put(BASE_API_PATH + "/multas/editar/:dni", (req, res) => {
    var dni = req.params.dni;
    var updatedMultas = req.body;
    console.log(Date()+" - PUT /multas/editar/"+dni);

    Multa.update({"dni": dni}, updatedMultas, (err, updateResult) =>{
        if(err) res.status(500).send({message: 'error al actualizar'})
        res.status(200).send({multa: updateResult})
    });
    // if(dni != updatedMultas.dni){
    //     res.sendStatus(409);
    //     return;
    // }

    // db.update({"dni": dni},updatedMultas, (err,updateResult)=>{
    //     if(err){
    //         console.error("Error accesing DB");
    //         res.sendStatus(500);
    //     }else{
    //         if(updateResult.n>1){
    //             console.warn("Incosistent DB: duplicated name");
    //         }else if(updateResult.n == 0) {
    //             res.sendStatus(404);
    //         } else {
    //             res.sendStatus(200);
    //         }
    //     }
    // });
});

app.delete(BASE_API_PATH + "/multas", (req, res) => {
    console.log(Date()+" - DELETE /multas");
    Multa.remove({}, (err) => {
        if(err){
            console.error("Error accesing DB");
            res.sendStatus(500);
        }
    });    
    res.sendStatus(200);
});

app.delete(BASE_API_PATH + "/multas/:dni", (req, res) => {
    var dni = req.params.dni;
    console.log(Date()+" - DELETE /multas/"+dni);

    Multa.remove({"dni": dni},(err, removeResult)=>{
        if(err){
            console.error("Error accesing DB");
            res.sendStatus(500);
        }else{
            if(removeResult.n>1){
                console.warn("Incosistent DB: duplicated name");
            }else if(removeResult.n == 0) {
                res.sendStatus(404);
            } else {
                res.sendStatus(200);
            }
        }
    });
});

module.exports = app;
