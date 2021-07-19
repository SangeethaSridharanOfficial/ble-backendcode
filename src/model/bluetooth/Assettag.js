const mongoose = require("mongoose");

var AssetTagSchema = {
    _id: String,
    name: String,
    coords: String,
    temperature: String,
    batteryLevel: String,
    clickNo: Number,
    lastClick: String,
    movementNo: Number,
    lastMovement: String
}

module.exports = mongoose.model("assetTags", AssetTagSchema);
