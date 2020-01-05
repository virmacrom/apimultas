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

    /*VALIDACION DEL DNI
    
    var numero
    var letr
    var letra
    var expresion_regular_dni = multa.dni;
 
    expresion_regular_dni = /^\d{8}[a-zA-Z]$/;
 
     if(expresion_regular_dni.test (dni) == true){
            numero = dni.substr(0,dni.length-1);
            letr = dni.substr(dni.length-1,1);
            numero = numero % 23;
            letra='TRWAGMYFPDXBNJZSQVHLCKET';
            letra=letra.substring(numero,numero+1);
             if (letra!=letr.toUpperCase()) {
                alert('Dni erroneo, la letra del NIF no se corresponde');
            }else{
                 alert('Dni correcto');
           }
        } else{
              alert('Dni erroneo, formato no válido');
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
/*
app.put(BASE_API_PATH + "/multas/editar", (req, res) => {
    console.log(Date()+" - PUT /multas/editar");
    res.sendStatus(405);
});*/

app.put(BASE_API_PATH + "/multas/editar/:dni", (req, res) => {
    console.log(Date()+" - PUT /multas/editar");
    
    let nuevoDni=req.params.dni;
    let update = req.body

    console.log(req.body); 

    Multa.findByIdAndUpdate(req.body.dni, update, (err, multaActualizada)=>{
        if (err) {
            return res.status(500).send({message: "Error al actualizar"})
            
        }else {
            return res.status(200).send({multa: "Multa actualizada"})
        }
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
