const mongoose = require("mongoose");
const MONGOURI = "mongodb+srv://humber:Humber2@cluster0.ahcoq.mongodb.net/BLE_DB?retryWrites=true&w=majority";
//const MONGOURI = "mongodb+srv://sheridan:Sheridan1!@cluster0.27ttm.mongodb.net/<dbname>?retryWrites=true&w=majority";
// const MONGOURI = "mongodb://localhost:27017/myFirstDB";
// mongod --bind_ip_all
const BLESensorSchema = require('../model/bleModels/BLESensor');
const VisitorSchema = require('../model/bleModels/BLEVisitor');
const AssetSchema = require('../model/bleModels/BLEVisitor');

class InitiateMongoServer{ 
    constructor(){
        this.mongoose = this.createMongoose();
        this.BleSchema = this.bleSchema();
        this.AssetSchema = this.assetSchema();
        this.VisitorSchema = this.visitorSchema();
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

    bleSchema(){
        var Schema = mongoose.Schema;
        var Bles = mongoose.model('bles', new Schema(BLESensorSchema));
        return Bles;
    }

    assetSchema(){
        var Schema = mongoose.Schema;
        var Assets = mongoose.model('assetTags', new Schema(AssetSchema));
        return Assets;
    }

    visitorSchema(){
        var Schema = mongoose.Schema;
        var Visitors = mongoose.model('visitors', new Schema(VisitorSchema));
        return Visitors;
    }
};

module.exports = new InitiateMongoServer();