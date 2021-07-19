const mongoose = require("mongoose");

var BLESensorSchema = {
    _id: String,
    name: String,
    coords: String,
    temperature: String,
    batteryLevel: String,
    isActive: Boolean
};

module.exports = mongoose.model("bleTags", BLESensorSchema);
