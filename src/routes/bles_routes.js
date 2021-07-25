'use strict';

const router = require('express').Router({ mergeParams: true }),
blesServices = require('../services/ble_services');

router.post('/BLETag', blesServices.handleTagInfo);
router.get('/allTags', blesServices.getAllTags );
//router.post('/addAssetTag', blesServices.addAssetTags);
//router.post('/addVisitors', blesServices.addVisitors);
//router.post('/removeBLETag', blesServices.removeBLETags);
//router.post('/removeAssetTag', blesServices.removeAssetTags);

module.exports = router;