const express = require('express');
const router = express.Router();
const { getAllApplications, getApplicationById } = require('../controllers/application.controller');

// Get semua
router.get('/', getAllApplications);

// Get spesifik by id
router.get('/:id', getApplicationById);

module.exports = router;