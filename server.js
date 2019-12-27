const db = require ('./db.js');

var express = require('express');
var bodyParser = require('body-parser');

var BASE_API_PATH = "/api/v1";

var app = express();
app.use(bodyParser.json());

app.get("/",(rew,res)=>{
    res.send("<html><body><h1>My server multas</h1></body></html>")
});

app.get(BASE_API_PATH + "/multas", (req, res) =>{
    console.log(Date() + " - GET /multas");
    db.find({},(err, multas) =>{
        if(err){
            console.log(Date () + " - " + err);
            res.sendStatus(500);
        }else{
            res.send(multas.map((multa) => {
                delete multa._id;
                return multa;
            }));
        }
    });
});

app.post(BASE_API_PATH + "/multas", (req, res) =>{
    console.log(Date() + " - POST /multas");
    var multa = req.body;
    db.insert(multa, (err) => {
        if (err){
            console.log (Date () + " - " + err);
            res.sendStatus(500);
        }else{
            res.sendStatus(201);
        }
    });
    multas.push(multa);
    res.sendStatus(201);
});

app.put(BASE_API_PATH + "/multas/editar", (req, res) => {
    console.log(Date()+" - PUT /multas/editar");
    res.sendStatus(405);
});

app.put(BASE_API_PATH + "/multas/editar/:dni", (req, res) => {
    var dni = req.params.dni;
    var updatedMultas = req.body;
    console.log(Date()+" - PUT /multas/editar/"+dni);

    db.update({"dni": dni}, updatedMultas, (err, updateResult) =>{
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
    db.remove({}, (err) => {
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

    db.remove({"dni": dni},(err, removeResult)=>{
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