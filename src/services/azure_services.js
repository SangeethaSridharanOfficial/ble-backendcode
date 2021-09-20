const fetchBlob = require("../methods/azure/fetchBlob")
const writeDeviceTwin = require("../methods/azure/writeDeviceTwin")
const ApiResponse = require("../methods/bluetooth/api_response")

async function read(params) {
    let {id} = params.query;
    sensorValues = await fetchBlob();
    // lastSensorValues = sensorValues[sensorValues.length - 1];
    let res = sensorValues.filter(val => Object.keys(val).indexOf(id.toLowerCase()) !== -1).pop();
    if(res)
        res = res[id.toLowerCase()];
    

    return new ApiResponse(res, true);
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
}