'use strict';

const router = require('express').Router({ mergeParams: true }),
blesServices = require('../services/ble_services');

router.post('/addTag', blesServices.handleTags);
router.post('/addUser', blesServices.addUser);

module.exports = router;