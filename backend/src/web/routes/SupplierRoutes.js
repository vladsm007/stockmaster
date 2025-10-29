const express = require('express')

const {
    createSupplier,
    getAllSuppliers,
    getSupplierById,
    updateSupplierById,
    deleteSupplier
} = require('../controllers/SupplierController.js')

const router = express.Router()


router.post('/', createSupplier)          // POST /api/v1/users
router.get('/', getAllSuppliers)          // GET /api/v1/users  
router.get('/:id', getSupplierById)       // GET /api/v1/users/123
router.put('/:id', updateSupplierById)    // PUT /api/v1/users/123
router.delete('/:id', deleteSupplier)     // DELETE /api/v1/users/123

module.exports = router