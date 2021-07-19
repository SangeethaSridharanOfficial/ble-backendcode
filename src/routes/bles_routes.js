'use strict';

const router = require('express').Router({ mergeParams: true }),
blesServices = require('../services/ble_services');

router.post('/addBLETag', blesServices.addBLETags);
//router.post('/addAssetTag', blesServices.addAssetTags);
//router.post('/addVisitors', blesServices.addVisitors);
//router.post('/removeBLETag', blesServices.removeBLETags);
//router.post('/removeAssetTag', blesServices.removeAssetTags);

module.exports = router;