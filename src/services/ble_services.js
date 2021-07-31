const ApiResponse = require("../methods/bluetooth/api_response")
const BeaconSchema = require("../model/bluetooth/BLESensor");
const AssetTagSchema = require('../model/bluetooth/Assettag');


const validateTagInfo = (data, type) => {
    try{
        let isValid = true;
        if(!data) isValid = false;

        if(!data.dId) isValid = false;
        if(data.toAdd){
            if(!data.dName || !data.coords) isValid = false;
        }
        return {data, isValid};
    }catch(err){
        console.error('Error in validateTagInfo ', err.stack);
    }
}

const findRecord = (schema, {_id}) => {
    return new Promise((resolve, reject) => {
        try{
            schema.findOne({_id}).exec((err, doc) => {
                if(err) {
                  return reject();
                } else {
                    return resolve(doc);
                }
            });
        }catch(err){
            console.error('Error in findRecord ', err.stack);
            return reject();
        }
    })
}

const saveTagInfo = (reqObj, dType) => {
    return new Promise((resolve, reject) => {
        try{
            console.log('Data to save ', reqObj);
            let schema = BeaconSchema;
            if(dType === 'asset'){
                schema = AssetTagSchema;
            }
            findRecord(schema, reqObj).then((doc) => {
                if(!doc){
                    new schema(reqObj).save((err) => {
                        if (err) {
                            console.log('Error ', err.message);
                            return reject();
                        }
                        console.log('Saved!!!');
                        return resolve();
                    });
                }else{
                    return resolve({errCode: 409, msg: 'Record Already Exists'});
                }
            }).catch(err => {
                return reject();
            });

            
        }catch(err){
            console.error('Error in saveTagInfo ', err.stack);
            return reject();
        }
    })
}

const updateTagInfo = (reqObj) => {
    return new Promise((resolve, reject) => {
        try{
            console.log('Data to Update ', reqObj);
            var schema = BeaconSchema;
            schema.updateOne({'dId': reqObj.dId}, {$set: {'isActive': reqObj.isActive}}, {upsert: true}, (err) => {
                if (err) {
                    console.log('Error');
                    return reject();
                }
                console.log('Updated!!!');
                return resolve()
            });
        }catch(err){
            console.error('Error in updateTagInfo ', err.stack);
            reject(err);
        }
    })
}

const deleteTags = ({dId, dType}) => {
    return new Promise((resolve, reject) => {
        try{
            let schema = BeaconSchema;
            if(dType === 'asset'){
                schema = AssetTagSchema;
            }
            findRecord(schema, {_id: dId}).then(doc => {
                if(!doc){
                    return resolve({errCode: 204, msg: 'No Record Found!!!'});
                }else{
                    schema.findOneAndRemove({'_id': dId}, (err, resp) => {
                        if(err) {
                            return reject();
                        } else {
                            console.log('Record Deleted ', resp);
                            return resolve();
                        }
                    })
                }
                
            }).catch(err => {
                return reject();
            });
        }catch(err){
            console.error('Error in deleteTags ', err.stack);
            return reject();
        }
    })
}

const removeBLETags = (reqData) => {
    return new Promise((resolve, reject) => {
        try{
            deleteTags(reqData).then((resp) => {
                if(resp){
                    return resolve(new ApiResponse(null, true, resp.errCode, resp.msg));
                }
                return resolve(new ApiResponse(null, true));
            }).catch(() => {
                return reject(new ApiResponse(null, false, 500, 'Database Error!!!'));
            })
        }catch(err){
            console.error('Error in removeBLETags ', err.stack);
            return reject(new ApiResponse(null, false, 500, 'Database Error!!!'));
        }
    })
}

const addBLETags = (reqData) => {
    return new Promise((resolve, reject) => {
        try{
            saveTagInfo({
                '_id': reqData.dId,
                'dId': reqData.dId,
                'name': reqData.dName,
                'coords': reqData.coords,
                'isActive': reqData.toAdd
            }, reqData.dType).then((resp) => {
                if(resp){
                    return resolve(new ApiResponse(null, true, resp.errCode, resp.msg));
                }
                return resolve(new ApiResponse(null, true));
            }).catch(() => {
                return reject(new ApiResponse(null, false, 500, 'Database Error!!!'));
            })
        }catch(err){
            console.error('Error in addBLETags ', err.stack);
            return reject(new ApiResponse(null, false, 500, 'Database Error!!!'))
        }
    })
}

const handleTagInfo = (req, res, next) => {
    try{
        let reqData = validateTagInfo(req.body);

        if(reqData.isValid){
            console.log('Req Data ', reqData);
            if(reqData.data.toAdd){
                addBLETags(reqData.data).then(resp => {
                    console.log('Resp: ', resp);
                    res.status(200).json(resp);
                }).catch(err => {
                    console.log('Resp: ', err);
                    res.status(200).json(err);
                });
            }else{
                removeBLETags(reqData.data).then(resp => {
                    console.log('Resp: ', resp);
                    res.status(200).json(resp);
                }).catch(err => {
                    console.log('Resp: ', err);
                    res.status(200).json(err);
                });
            }
        }else{
            res.status(200).json(new ApiResponse(null, false, 500, 'Invalid Data!!'));
        }
        
    }catch(err){
        console.error('Error in handleTagInfo ', err.stack);
        res.status(200).json(new ApiResponse(null, false, 500, 'Something went wrong!!'))
    }
}

const getAllTags = async(req, res, next) => {
    try{
        let assetTags = await AssetTagSchema.find({});
        let beaconTags = await BeaconSchema.find({}), allTags = [];

        assetTags.forEach(tag => {
            allTags.push({_id: tag._id, name: tag.name, dType: 'asset', coords: tag.coords});
        })

        beaconTags.forEach(tag => {
            allTags.push({_id: tag._id, name: tag.name, dType: 'beacon', coords: tag.coords});
        })
        console.log('Devices ', allTags);
        res.status(200).json(new ApiResponse(allTags, true));
    }catch(err){
        console.error('Error in findTags ', err.stack);
        res.status(200).json(new ApiResponse(null, false, 500, 'Something went wrong!!'))
    }
}

module.exports = {
    handleTagInfo,
    getAllTags
    // addBLETags,
    //addAssetTags,
    //addVisitors
    // removeBLETags,
    //removeAssetTags,
}