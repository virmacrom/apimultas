const app =require('./server.js');
const dbConnect = require('./db');

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

//app.listen(port);

console.log("Server ready 2!");
