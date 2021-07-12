const ApiResponse = require('../model/bleModels/apiResponse');
const { basicInfo } = require('../config/dbMethods');

const saveBasicBleInfo = (reqData) => {
    try{
        basicInfo({
            '_id': reqData.dId,
            'name': reqData.dName
        });
    }catch(err){
        console.error('Error in saveBasicBleInfo ', err.stack);
    }
}

const basicInfoApi = (req, res, next) => {
    try{
        saveBasicBleInfo(req.body);
        res.status(200).json(new ApiResponse(null, true));
    }catch(err){
        console.error('Error in basicInfoApi ', err.stack);
        next(err);
    }
}

module.exports = {
    basicInfoApi
}