
const express = require('express')
const {
    createUser,
    getAllUsers,
    getUserById,
    updateUserById,
    deleteUser
} = require('../controllers/UserController.js')

const router = express.Router()


router.post('/', createUser)          // POST /api/v1/users
router.get('/', getAllUsers)          // GET /api/v1/users  
router.get('/:id', getUserById)       // GET /api/v1/users/123
router.put('/:id', updateUserById)    // PUT /api/v1/users/123
router.delete('/:id', deleteUser)     // DELETE /api/v1/users/123

module.exports = router