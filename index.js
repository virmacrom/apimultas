var express= require("express");
var bodyParser = require("body-parser");
var DataStore=require ("nedb");

var port = (process.env.PORT || 3000);
var BASE_API_PATH ="/api/v1";
var DB_FILE_NAME= __dirname + "/multas.json";

console.log("Starting API server...");

var app = express();
app.use(bodyParser.json());

var db = new DataStore({
    filename: DB_FILE_NAME,
    autoload: true
});

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

app.put(BASE_API_PATH + "/multas", (req, res) =>{
    console.log(Date() + " - PUT /multas");
    var multa = req.body;
    db.update(multa, (err) => {
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

app.listen(port);
console.log("Server ready!");

