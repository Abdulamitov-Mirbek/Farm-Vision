// server/routes/suppliers.js
const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const { protect } = require('../middleware/authMiddleware');

// Все маршруты защищены
router.use(protect);

router.get('/', supplierController.getAllSuppliers);
router.post('/', supplierController.createSupplier);
router.get('/:id', supplierController.getSupplierById);
router.put('/:id', supplierController.updateSupplier);
router.patch('/:id/status', supplierController.updateSupplierStatus);
router.delete('/:id', supplierController.deleteSupplier);

module.exports = router;