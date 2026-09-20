const express = require('express');
const router = express.Router();
const { getAllApplications, getApplicationById } = require('../controllers/application.controller');

// Get semua
router.get('/applications', getAllApplications);

// Get spesifik
router.get('/applications/:id', getApplicationById);

module.exports = router;