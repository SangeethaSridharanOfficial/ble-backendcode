'use strict';

const router = require('express').Router({ mergeParams: true }),
blesServices = require('../services/blesServices');

router.post('/basicInfo', blesServices.basicInfoApi);

module.exports = router;