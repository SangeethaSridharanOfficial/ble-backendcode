const iothub = require('azure-iothub');
const connectionString = 'HostName=VentilatorIoTHub.azure-devices.net;SharedAccessKeyName=service;SharedAccessKey=nv6DwP86VwqZyfIR2iuM2/WVhJz+oy3M9JfBGOYRj74=';
const registry = iothub.Registry.fromConnectionString(connectionString);

const writeDeviceTwin = (ts, ds, en, tsv) => {
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

module.exports = writeDeviceTwin