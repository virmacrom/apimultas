const db = require ('./db.js');

var express = require('express');
var bodyParser = require('body-parser');

var BASE_API_PATH = "/api/v1";

var app = express();
app.use(bodyParser.json());

app.get("/",(rew,res)=>{
    res.send("<html><body><h1>My server</h1></body></html>")
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

module.exports = app;
