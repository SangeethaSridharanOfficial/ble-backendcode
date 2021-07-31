const mongoose = require("mongoose");

var BeaconSchema = new mongoose.Schema({
    _id: String,
    name: String,
    coords: String,
    temperature: String,
    batteryLevel: String
});

module.exports = mongoose.model("bleTags", BeaconSchema);
