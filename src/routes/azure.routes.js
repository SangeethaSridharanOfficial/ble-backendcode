const express = require('express');
const router = express.Router();

const azureService = require('../services/azure.service');

router.get('/AllItems', azureService.getItems);
router.get('/LatestItem', azureService.getLastItem);
router.get('/Setpoints', azureService.getSetpoints);
router.put('/Setpoints/:id', azureService.updateSetpoints);

module.exports = router;