const mongoose = require("mongoose");

var AssetTagSchema = {
    _id: String,
    name: String,
    coords: String,
    isSpecialDevice: Boolean,
    temperature: String,
    batteryLevel: String,
    clickNo: Number,
    lastClick: String,
    movementNo: Number,
    lastMovement: String
}

module.exports = mongoose.model("assetTags", AssetTagSchema);
