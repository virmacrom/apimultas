//const db = require ('./db.js');

var express = require('express');
var bodyParser = require('body-parser');

const Multa = require ('./multas');
const passport = require ('passport');
const swaggerDoc = require ('./swagger-doc');

require('./passport.js');

var BASE_API_PATH = "/api/v1";

var app = express();
app.use(bodyParser.urlencoded({extended: false})) //añadida
app.use(bodyParser.json());
app.use(passport.initialize());

swaggerDoc(app);

app.get("/",(req,res)=>{
    res.send("<html><body><h1> Página principal del servidor de Api multas.</h1><h2>Acceder a /api-docs para consultar la documentación en swagger</h2></body></html>")
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

app.put(BASE_API_PATH + "/multas/editar/:_id", (req, res) => {
    var _id = req.params._id;
    var updatedMultas = req.body;
    console.log(Date()+" - PUT /multas/editar/"+_id);

    if(_id != updatedMultas._id){
        console.log("El id a actualizar no existe en la BD");
        res.sendStatus(409);
        return;
    }

    Multa.update({"_id": _id},updatedMultas, (err,updateResult)=>{
        if(err){
            console.error("Error accediendo a la BD");
            res.sendStatus(500);
        }else{
            if(updateResult.n>1){
                console.warn("Inconsistencia en la BD: id duplicado");
            }else if(updateResult.n == 0) {
                res.sendStatus(404);
            } else {
                res.sendStatus(200);
            }
        }
    });
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

app.delete(BASE_API_PATH + "/multas/:_id", (req, res) => {
    var _id = req.params._id;
    console.log(Date()+" - DELETE /multas/"+_id);

    Multa.remove({"_id": _id},(err, removeResult)=>{
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