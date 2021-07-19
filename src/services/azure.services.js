const fetchBlob = require("../methods/azure/fetchBlob")
const writeDeviceTwin = require("../methods/azure/writeDeviceTwin")


async function read() {
    sensorValues = await fetchBlob();
    lastSensorValues = sensorValues[sensorValues.length - 1];
    
    data = [
        {id: 1, temperature: lastSensorValues.temperatureV1, humidity: lastSensorValues.humidityV1, 
            damper: lastSensorValues.damperV1, presence: lastSensorValues.presenceV1, dateTime: lastSensorValues.DateTime},
        {id: 2, temperature: 14, humidity: 70, damper: 20, presence: 0, dateTime: lastSensorValues.DateTime},
        {id: 3, temperature: 30, humidity: 20, damper: 32, presence: 0, dateTime: lastSensorValues.DateTime},
        {id: 4, temperature: 26, humidity: 41, damper: 55, presence: 0, dateTime: lastSensorValues.DateTime}
    ];
    console.log('Sensores: ', data);
    return data;
}
setpoints = [{id: 1}, {id: 2}, {id: 3}, {id: 4}];

module.exports = {
    getItems: async (req, res) => {
        allData = await fetchBlob();
        return res.status(200).send({allData})
    },

    getLastItem: async (req, res) => {
        data = await read();
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