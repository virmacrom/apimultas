var express = require('express');
var bodyParser = require('body-parser');
var DataStore=require ("nedb");

var port = 4000;
var BASE_API_PATH = "/api/v2";
var DB_FILE_NAME= __dirname + "/aseguradoras.json";

// var multas=[ 
//     {"DNI":"3456899c","id":DNI+"0001","puntos":"12","name": "Atropello","victima":"12345678X","rango":"50+"},       
//     {"DNI":"3456899c","id":DNI+"0002","puntos":"12","name": "Atropello","victima":"12345678X","rango":"100+"},
//     {"DNI":"3456899c","id":DNI+"0004","puntos":"12","name": "Atropello","victima":"12345678X","rango":"500+"},
//     {"DNI":"3456899c","id":DNI+"0003","puntos":"12","name": "Atropello","victima":"12345678X","rango":"200+"},
//     {"DNI":"3456899c","id":DNI+"0006","puntos":"12","name": "Exceso_velocidad","Exceso":"20","rango":"100+"},
//     {"DNI":"3456899c","id":DNI+"0005","puntos":"12","name": "Exceso_velocidad","Exceso":"10","rango":"50+"},
//     {"DNI":"3456899c","id":DNI+"0007","puntos":"12","name": "Exceso_velocidad","Exceso":"25","rango":"200+"},
//     {"DNI":"3456899c","id":DNI+"0008","puntos":"12","name": "Exceso_velocidad","Exceso":"30","rango":"500+"},
//     {"DNI":"3456899c","id":DNI+"0009","puntos":"12","name": "Drogas","rango":"500+"},
//     {"DNI":"3456899c","id":DNI+"0010","puntos":"12","name": "Alcohol","rango":"500+"},
//historico de multas/ cambiar conductor/ PUNTOS/
// ];

console.log("Starting API server...");

var app = express();
app.use(bodyParser.json());

//Inicializar la BD nebd
var db = new DataStore({
    filename: DB_FILE_NAME,
    autoload: true
});

app.get("/",(rew,res)=>{
    res.send("<html><body><h1>My server</h1></body></html>")
});

app.get(BASE_API_PATH + "/aseguradoras", (req, res) =>{
    console.log(Date() + " - GET /multas");
    res.send([]);
});

app.post(BASE_API_PATH + "/aseguradoras", (req, res) =>{
    console.log(Date() + " - POST /multas");
    var multas = req.body;
    //multas.push(multa);
    //res.sendStatus(201);
    db.insert(multas, (err)=>{
        if (err){
            console.log(Date() + " - " + err);
            res.sendStatus(500);
        }else{
            res.sendStatus(201);
        }
    });
});

app.listen(port);

console.log("Server ready!");
