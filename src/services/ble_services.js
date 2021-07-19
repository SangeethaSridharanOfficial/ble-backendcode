const ApiResponse = require('./api_response');
const { saveTagInfo, updateTagInfo } = require('./db_methods');

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

const saveBleUserInfo = async(reqData) => {
    try{
        // Todo -> Check for emailID
        await saveUserInfo({
            '_id': reqData.emailId,
            'password': reqData.password
        })
    }catch(err){
        console.error('Error in saveBleUserInfo ', err.stack);
    }
}

const handleTags = (req, res, next) => {
    try{
        handleTagInfo(req.body).finally(resp => {
            res.status(200).json(resp);
        })
    }catch(err){
        console.error('Error in addTag ', err.stack);
        next(err);
    }
}

const addUser = (req, res, next) => {
    try{
        saveBleUserInfo(req.body).finally(resp => {
            res.status(200).json(resp);
        })
    }catch(err){
        console.error('Error in userInfoApi ', err.stack);
        next(err);
    }
}

module.exports = {
    handleTags,
    addUser
}