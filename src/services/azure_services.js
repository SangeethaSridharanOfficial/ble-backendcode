const fetchBlob = require("../methods/azure/fetchBlob")
const writeDeviceTwin = require("../methods/azure/writeDeviceTwin")
const ApiResponse = require("../methods/bluetooth/api_response")

async function read(params) {
    let {id} = params.query;
    sensorValues = await fetchBlob();
    // lastSensorValues = sensorValues[sensorValues.length - 1];
    let res = sensorValues.filter(val => Object.keys(val).indexOf(id.toLowerCase()) !== -1).pop();
    let respObj = {}
    if(res){
        respObj['timestamp'] = res['timestamp'];
        respObj = {...respObj, ...res[id.toLowerCase()]}
    }
    
    return new ApiResponse(respObj, true);
}

const getTrends = async(params) => {
    try{
        let {id} = params.query;
        sensorValues = await fetchBlob();
        let res = sensorValues.filter(val => Object.keys(val).indexOf(id.toLowerCase()) !== -1);
        let respObj = [];

        res.forEach(data => {
            respObj.push({timestamp: data['timestamp'], ...data[id.toLowerCase()]})
        });

        return new ApiResponse(respObj, true);
    }catch(err){
        console.error('Error in getTrends ', err.stack);
    }
}

const fetchLocations = async(params) => {
    try{
        assetValues = await fetchBlob();
        let {id} = params.query,
        res = assetValues.filter(val => Object.keys(val).indexOf(id.toLowerCase()) !== -1),
        respObj = [];

        res.forEach(data => {
            respObj.push(data[id.toLowerCase()])
        });

        return new ApiResponse(respObj, true);
    }catch(err){
        console.error('Error in fetchLocations ', err);
    }
}

const getAssetsLocations = async(req) => {
    let respObj = [];
    try{
        assetValues = await fetchBlob();
        
        req.body.assetIds.forEach(id => {
            res = assetValues.filter(val => Object.keys(val).indexOf(id.toLowerCase()) !== -1).pop();
            
            if( res ){
                res = res[id.toLowerCase()];
                respObj.push(res);
            }
        })
        // if(respObj.length === req.body.assetIds.length){
        return new ApiResponse(respObj, true);
        // }else{
        //     return new ApiResponse([], true);
        // }
        
    }catch(err){
        console.error('Error in getAssetsLocations ', err);
        return new ApiResponse(respObj, true);
    }
}

setpoints = [{id: 1}, {id: 2}, {id: 3}, {id: 4}];

module.exports = {
    getItems: async (req, res) => {
        allData = await fetchBlob();
        return res.status(200).send({allData})
    },

    getLastItem: async (req, res) => {
        data = await read(req);
        return res.status(200).send(data);
    },

    getSetpoints: async (req, res) => {
        return res.status(200).send(setpoints);
    },

    updateSetpoints: async (req, res) => {
        const setpOneRoom = setpoints.find(c => c.id === parseInt(req.params.id));
        if (!setpOneRoom) return res.status(404).send('The data with the given id not found');

        setpOneRoom.temperatureSetp = req.body.temperatureSetp;
        setpOneRoom.damperSetp = req.body.damperSetp;
        setpOneRoom.enableVac = req.body.enableVac;
        setpOneRoom.temperatureSetpVac = req.body.temperatureSetpVac;
        
        if (req.params.id === '1') {
            writeDeviceTwin(setpOneRoom.temperatureSetp, setpOneRoom.damperSetp, setpOneRoom.enableVac, setpOneRoom.temperatureSetpVac);    
        }
        return res.status(200).send(setpOneRoom);
    },

    getTempTrends: async (req, res) => {
        trendsData = await getTrends(req);
        return res.status(200).send(trendsData)
    },

    getAssetLocations: async (req, res) => {
        locData = await fetchLocations(req);
        return res.status(200).send(locData)
    },

    fetchAssetsLocations: async(req,  res) => {
        locData = await getAssetsLocations(req);
        return res.status(200).send(locData)
    }
}