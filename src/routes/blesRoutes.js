'use strict';

const ApiResponse = require('../model/bleModels/apiResponse');
const router = require('express').Router({ mergeParams: true }),
blesServices = require('../services/blesServices');

router.post('/basicInfo', (req, res, next) => {
    blesServices.saveBasicBleInfo(req.body);
    res.status(200).json(new ApiResponse(null, true));
});

module.exports = router;