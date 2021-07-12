const mongoose = require("mongoose");
const MONGOURI = "mongodb+srv://humber:Humber2@cluster0.ahcoq.mongodb.net/BLE_DB?retryWrites=true&w=majority";
//const MONGOURI = "mongodb+srv://sheridan:Sheridan1!@cluster0.27ttm.mongodb.net/<dbname>?retryWrites=true&w=majority";
// const MONGOURI = "mongodb://localhost:27017/myFirstDB";
// mongod --bind_ip_all
class InitiateMongoServer{ 
    constructor(){
        this.mongoose = this.createMongoose();
        this.DeviceSchema = this.deviceSchema();
    }

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

    deviceSchema(){
        var Schema = mongoose.Schema;

        var deviceSchema = new Schema({
            _id: String,
            name: String
        });

        var Devices = mongoose.model('Devices', deviceSchema );
        return Devices;
    }
};

module.exports = new InitiateMongoServer();