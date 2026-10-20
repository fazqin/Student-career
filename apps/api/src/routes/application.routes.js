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
    validateCreateApplication,
    validateUpdateApplication,
    validatePatchApplication
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
router.post('/', validateCreateApplication, createApplication);

// PUT update seluruh data
router.put('/:id', validateUpdateApplication, updateApplication);

// PATCH update status
router.patch('/:id',validatePatchApplication, patchApplication);

// DELETE hapus lamaran
router.delete('/:id', deleteApplication);

module.exports = router;