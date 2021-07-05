const mongoose = require("mongoose");
// const MONGOURI = "mongodb+srv://humber:Humber2@cluster0.ahcoq.mongodb.net/<dbname>?retryWrites=true&w=majority";
//const MONGOURI = "mongodb+srv://sheridan:Sheridan1!@cluster0.27ttm.mongodb.net/<dbname>?retryWrites=true&w=majority";
const MONGOURI = "mongodb://localhost:27017/myFirstDB";
// mongod --bind_ip_all
const InitiateMongoServer = async() => {
    try {
        await mongoose.connect(MONGOURI, {
            useNewUrlParser: true
        });
        console.log("Connected to DB !!");
    } catch (e) {
        console.log(e);
        throw e;
    }
};

module.exports = InitiateMongoServer;


// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://karan_gajjar:<password>@cluster0.3ysot.mongodb.net/<dbname>?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect(err => {
//     const collection = client.db("test").collection("devices");
//     // perform actions on the collection object
//     client.close();
// });