const express = require('express')

const {
    createUser,
    getAllUsers,
    getUserById,
    updateUserById,
    deleteUser
} = require('../controllers/UserController.js')

const { authenticateToken, authorize } = require('../middleware/auth.js')

const router = express.Router()

// Apenas ADMIN pode criar usuários
router.post('/', authenticateToken, authorize('ADMIN'), createUser)          // POST /api/v1/users
router.get('/', authenticateToken, authorize('ADMIN'), getAllUsers)          // GET /api/v1/users  
router.get('/:id', authenticateToken, authorize('ADMIN'), getUserById)       // GET /api/v1/users/123
router.put('/:id', authenticateToken, authorize('ADMIN'), updateUserById)    // PUT /api/v1/users/123
router.delete('/:id', authenticateToken, authorize('ADMIN'), deleteUser)     // DELETE /api/v1/users/123

module.exports = router