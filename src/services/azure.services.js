const { BlobServiceClient } = require("@azure/storage-blob");
const connStr = "DefaultEndpointsProtocol=https;AccountName=ventilatorblobs;AccountKey=KD6yOeibANuW9PAkl+FbkTEblxYYPufZ133K2E/NEZcqtoBuE2rmjcYesut0Lkki9e2Xnp9eu/xm3FNdWe2D+w==;EndpointSuffix=core.windows.net";
const blobServiceClient = BlobServiceClient.fromConnectionString(connStr);
const containerName = "ventilatorblobc";
const accountName = "ventilatorblobs";

const { check, validationResult } = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/User");

const iothub = require('azure-iothub');
const connectionString = 'HostName=VentilatorIoTHub.azure-devices.net;SharedAccessKeyName=service;SharedAccessKey=nv6DwP86VwqZyfIR2iuM2/WVhJz+oy3M9JfBGOYRj74=';
const registry = iothub.Registry.fromConnectionString(connectionString);

const Joi = require('joi');

const fetchSensors = async () => {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    let blobs = containerClient.listBlobsFlat();
    
    for await (const blob of blobs) {
        const blobClient = containerClient.getBlobClient(`${blob.name}`);
        // Get blob content from position 0 to the end
        // In Node.js, get downloaded data by accessing downloadBlockBlobResponse.readableStreamBody
        const downloadBlockBlobResponse = await blobClient.download();
        
        const downloaded = (await streamToBuffer(downloadBlockBlobResponse.readableStreamBody)).toString();
        
        // Storing as JSON data:
        list = JSON.stringify(downloaded);
        myJSON = JSON.parse(list);

        const response = replaceAll(myJSON, "\r\n", ",")
        return JSON.parse(`[${response}]`);
        
        function replaceAll(string, search, replace) {
        return string.split(search).join(replace);
        }
        
        // [Node.js only] A helper method used to read a Node.js readable stream into a Buffer
        async function streamToBuffer(readableStream) {
            return new Promise((resolve, reject) => {
            const chunks = [];
            readableStream.on("data", (data) => {
                chunks.push(data instanceof Buffer ? data : Buffer.from(data));
            });
            readableStream.on("end", () => {
                resolve(Buffer.concat(chunks));
            });
            readableStream.on("error", reject);
            });
        }
    }
}

const writeSetpoints = (ts, ds, en, tsv) => {
    registry.getTwin('VentilatorDeviceTwin', function(err, twin){
        if (err) {
            console.error(err.constructor.name + ': ' + err.message);
        } else {
            var patch = {
                tags: {
                    location: {
                        region: 'Canada',
                        Company: 'CE',
                        Province: 'Ontario',
                        Project:'Ventilator'
                    }
                },
                properties: {
                    "desired": {
                        "Temperature_Setpoint": ts,
                        "Damper_Setpoint": ds,
                        "EnableEmptyRoom": en,
                        "Temperature_Setpoint_vac": tsv,
                    }
                }
            };
            
            twin.update(patch, function(err) {
                if (err) {
                    console.error('Could not update twin: ' + err.constructor.name + ': ' + err.message);
                } else {
                    console.log(twin.deviceId + ' twin updated successfully');
                }
            });
        }
    });
}

const fetchSetpoints = () => {
    registry.getTwin('VentilatorDeviceTwin', function(err, twin){
        if (err) {
            console.error(err.constructor.name + ': ' + err.message);
        } else {
            tempSetp=twin["properties"]["desired"]["Temperature_Setpoint"]
            dampSetp=twin["properties"]["desired"]["Damper_Setpoint"]
            tempSetpVac=twin["properties"]["desired"]["Temperature_Setpoint_vac"]
            enVacMod=twin["properties"]["desired"]["EnableEmptyRoom"]
            setpoints = {temperatureSetp1: tempSetp, damperSetp1: dampSetp, enableVac1: enVacMod, temperatureSetpVac1: tempSetpVac};

        }
        console.log("Setpoint: ", setpoints);
        return setpoints;
    })
}

function validateSetpoint(setpoint) {
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(setpoint, schema);
    
}

async function read() {
    sensorValues = await fetchSensors();
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
        allData = await fetchSensors();
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
            writeSetpoints(setpOneRoom.temperatureSetp, setpOneRoom.damperSetp, setpOneRoom.enableVac, setpOneRoom.temperatureSetpVac);    
        }
        return res.status(200).send(setpOneRoom);
    },
}