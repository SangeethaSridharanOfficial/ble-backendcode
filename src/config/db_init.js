const mongoose = require("mongoose");
const MONGOURI = "mongodb+srv://humber:Humber2@cluster0.ahcoq.mongodb.net/BLE_DB?retryWrites=true&w=majority";

class InitiateMongoServer{ 

    async createMongoose(){
        try {
            mongoose.connect(MONGOURI, {useNewUrlParser: true, useUnifiedTopology: true});

            //Get the default connection
            var db = mongoose.connection;

            //Bind connection to error event (to get notification of connection errors)
            db.on('error', console.error.bind(console, 'MongoDB connection error:'));
            
            console.log("Connected to DB !!");
            
            return db
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
};

module.exports = new InitiateMongoServer();