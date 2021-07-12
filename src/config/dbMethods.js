const {mongoose, deviceSchema} = require("./dbInit");

const basicInfo = (reqObj) => {
    console.log('Data to save ', reqObj);
    var Device = deviceSchema(),
    infoInstance = new Device(reqObj);


    infoInstance.save(function (err) {
        if (err) return console.log('Error')
        // saved!
        console.log('Saved!!!');
    });
}

module.exports = {
    basicInfo
}
