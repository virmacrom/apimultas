const mongoose = require('mongoose');
const DB_URL = (process.env.MONGO_URL || 'mongodb+srv://Virginia:MongoUS123@cluster0-4eldc.mongodb.net/test?retryWrites=true&w=majority');

const dbConnect =function(){
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error: '));
    return mongoose.connect(DB_URL, {useNewUrlParser: true});

}

// var DataStore = require ('nedb');
// var DB_FILE_NAME = __dirname + "/multas.json";

// var db = new DataStore({
//     filename: DB_FILE_NAME,
//     autoload: true
// });

// module.exports=db;
//console.log(DB_URL);

module.exports=dbConnect;