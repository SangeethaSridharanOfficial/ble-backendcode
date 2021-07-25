const mongoose = require("mongoose");

var BeaconSchema = new mongoose.Schema({
    _id: String,
    dId: String,
    name: String,
    coords: String,
    temperature: String,
    batteryLevel: String,
    isActive: Boolean
});

module.exports = mongoose.model("bleTags", BeaconSchema); //beacon
