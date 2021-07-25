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

module.exports = {
    validateTagInfo
}