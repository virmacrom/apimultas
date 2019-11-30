var express = require('express');
var bodyParser = require('body-parser');

var port = 4000;
var BASE_API_PATH = "/api/v2";

var multas=[ 

    {"name": "Atropello","victima":"12345678X","rango":"50+"},
    {"name": "Atropello","victima":"12345678X","rango":"100+"},
    {"name": "Atropello","victima":"12345678X","rango":"200+"},
    {"name": "Atropello","victima":"12345678X","rango":"500+"},
    {"name": "Exceso_velocidad","Exceso":"10","rango":"50+"},
    {"name": "Exceso_velocidad","Exceso":"20","rango":"100+"},
    {"name": "Exceso_velocidad","Exceso":"25","rango":"200+"},
    {"name": "Exceso_velocidad","Exceso":"30","rango":"500+"},
    {"name": "Drogas","rango":"500+"},
    {"name": "Alcohol","rango":"500+"},
    {"name": "Inhibidor","rango":"6000+"}

];

console.log("Starting API server...");

var app = express();
app.use(bodyParser.json());

app.get("/",(rew,res)=>{
    res.send("<html><body><h1>My server</h1></body></html>")
});

app.get(BASE_API_PATH + "/aseguradoras", (req, res) =>{
    console.log(Date() + " - GET /multas");
    res.send(multas);
});

app.post(BASE_API_PATH + "/aseguradoras", (req, res) =>{
    console.log(Date() + " - POST /multas");
    var contact = req.body;
    multas.push(multa);
    res.sendStatus(201);
});

app.listen(port);

console.log("Server ready!");
