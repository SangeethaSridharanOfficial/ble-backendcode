const ApiResponse = require("../methods/bluetooth/api_response")
const BleSchema = require("../model/bluetooth/BLESensor")

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

const handleTagInfo = async(reqData) => {
    try{
        if(reqData.toAdd){
            await saveTagInfo({
                '_id': reqData.dId,
                'name': reqData.dName,
                'coords': reqData.coords,
                'isActive': reqData.toAdd
            })
        }else{
            await updateTagInfo({
                '_id': reqData.dId,
                'isActive': reqData.toAdd
            })
        }
        
    }catch(err){
        console.error('Error in addTagInfo ', err.stack);
    }
}

const addBLETags = (req, res, next) => {
    try{
        handleTagInfo(req.body).finally(resp => {
            res.status(200).json(resp);
        })
    }catch(err){
        console.error('Error in addTag ', err.stack);
        next(err);
    }
}

module.exports = {
    addBLETags,
    //addAssetTags,
    //addVisitors
    //removeBLETags,
    //removeAssetTags,
}