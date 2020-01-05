const app =require('./server.js');
const dbConnect = require('./db');
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

var port = (process.env.PORT || 3000);

console.log("Starting API server at "+port);

dbConnect().then(
    () =>{
        app.listen(port);
        console.log("server ready!");       
    },
    err => {
        console.log("connection ERROR: "+err);
    }
)
