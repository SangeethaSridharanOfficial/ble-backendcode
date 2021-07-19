const ApiResponse = require("./api_response");
const {mongoose, BleSchema, AssetSchema} = require("../config/db_init");

const saveTagInfo = (reqObj) => {
    try{
        return new Promise((resolve, reject) => {
            console.log('Data to save ', reqObj);
            var infoInstance = new BleSchema(reqObj);

            infoInstance.save((err) => {
                if (err) {
                    console.log('Error');
                    return reject(new ApiResponse(null, false, 500, 'Database Error!!!'));
                }
                console.log('Saved!!!');
                return resolve(new ApiResponse(null, true))
            });
        })
        
    }catch(err){
        console.error('Error in saveTagInfo ', err.stack);
    }
    
}

const updateTagInfo = (reqObj) => {
    try{
        return new Promise((resolve, reject) => {
            console.log('Data to Update ', reqObj);
            var infoInstance = new BleSchema();

            infoInstance.updateOne({'_id': reqObj._id}, {$set: {'isActive': reqObj.isActive}}, (err) => {
                if (err) {
                    console.log('Error');
                    return reject(new ApiResponse(null, false, 500, 'Database Error!!!'));
                }
                console.log('Updated!!!');
                return resolve(new ApiResponse(null, true))
            });
        })
    }catch(err){
        console.error('Error in updateTagInfo ', err.stack);
        reject(err);
    }
}

module.exports = {
    saveTagInfo,
    updateTagInfo
}
