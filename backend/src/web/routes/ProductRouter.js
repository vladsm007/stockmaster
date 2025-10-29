const express = require('express')

const {
    createProduct,
    getAllProducts,
    getProductById,
    getProductBySKU,
    updateProductById,
    deleteProduct
} = require('../controllers/ProductController.js')

const router = express.Router()


router.post('/', createProduct);
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.get('/sku/:sku', getProductBySKU);
router.put('/:id', updateProductById);
router.delete('/:id', deleteProduct);

module.exports = router