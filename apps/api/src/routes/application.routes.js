
const express = require('express');
const router = express.Router();

const {
  getAllApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  patchApplication,
  deleteApplication
} = require('../controllers/application.controller');

const {
  validateApplicationBody
} = require('../middlewares/validation/application.validate');

const {
  authenticateToken
} = require('../middlewares/auth.middleware');

// Semua endpoint aplikasi wajib login
router.use(authenticateToken);

// GET semua lamaran
router.get('/', getAllApplications);

// GET lamaran berdasarkan ID
router.get('/:id', getApplicationById);

// POST tambah lamaran
router.post('/', validateApplicationBody, createApplication);

// PUT update seluruh data
router.put('/:id', validateApplicationBody, updateApplication);

// PATCH update status
router.patch('/:id', patchApplication);

// DELETE hapus lamaran
router.delete('/:id', deleteApplication);

module.exports = router;