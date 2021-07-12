const {mongoose, DeviceSchema} = require("./dbInit");

const basicInfo = (reqObj) => {
    console.log('Data to save ', reqObj);
    var infoInstance = new DeviceSchema(reqObj);

    infoInstance.save(function (err) {
        if (err) return console.log('Error')
        // saved!
        console.log('Saved!!!');
    });
}

module.exports = {
    basicInfo
}
