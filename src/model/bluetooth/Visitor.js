const mongoose = require("mongoose");

var VisitorSchema = {
    _id: String,
    name: String,
    coords: String
}

module.exports = mongoose.model("visitors", VisitorSchema);
