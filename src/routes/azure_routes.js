const express = require('express');
const router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator/check");
const User = require("../model/User");

const azureService = require('../services/azure_services');

router.get('/AllItems', azureService.getItems);

router.get('/LatestItem', azureService.getLastItem);

router.get('/Setpoints', azureService.getSetpoints);

router.put('/Setpoints/:id', azureService.updateSetpoints);

router.get('/Temperature/trends', azureService.getTempTrends);

router.get('/location/asset', azureService.getAssetLocations);
module.exports = router;