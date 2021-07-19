const express = require('express');
const router = express.Router();
const paymentServices = require('../services/payment.services');

router.post('/user/payment', paymentServices.payment);

module.exports = router;