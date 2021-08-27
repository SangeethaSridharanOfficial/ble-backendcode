const mongoose = require("mongoose");

var BeaconSchema = new mongoose.Schema({
    _id: String,
    name: String,
    coords: String,
    isSpecialDevice: Boolean,
    temperature: String,
    batteryLevel: String
});

module.exports = mongoose.model("bleTags", BeaconSchema);
