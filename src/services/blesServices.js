

const saveBasicBleInfo = (reqData) => {
    try{
        console.log('ble ', reqData);
        
    }catch(err){
        console.error('Error in saveBasicBleInfo ', err.stack);
        next(err);
    }
}

module.exports = {
    saveBasicBleInfo
}