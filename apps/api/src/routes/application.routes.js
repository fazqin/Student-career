const express = require('express');
const router = express.Router();
const { getAllApplications, getApplicationById, createApplication, updateApplication, patchApplication, deleteApplication } = require('../controllers/application.controller');

// Get semua
router.get('/', getAllApplications);
// Get spesifik by id
router.get('/:id', getApplicationById);
// POST tambah lamaran
router.post('/', createApplication);
// PUT update semua data
router.put('/:id', updateApplication);
// PATCH update status
router.patch('/:id', patchApplication);
// DELETE hapus lamaran
router.delete('/:id', deleteApplication);

module.exports = router;