const express = require('express');
const router = express.Router();
const { getAllApplications, getApplicationById, createApplication, updateApplication, patchApplication, deleteApplication } = require('../controllers/application.controller');

const { validateApplicationBody } = require('../middlewares/validation/application.validate');
// Get semua
router.get('/', getAllApplications);
// Get spesifik by id
router.get('/:id', getApplicationById);
// POST tambah lamaran
router.post('/', validateApplicationBody, createApplication);
// PUT update semua data
router.put('/:id', validateApplicationBody, updateApplication);
// PATCH update status
router.patch('/:id', patchApplication);
// DELETE hapus lamaran
router.delete('/:id', deleteApplication);

module.exports = router;