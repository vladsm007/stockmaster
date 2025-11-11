const express = require('express')
const { login, getProfile, refreshToken } = require('../controllers/AuthController.js')
const { authenticateToken } = require('../middleware/auth.js')

const router = express.Router()

router.post('/login',login)
router.get('/profile', authenticateToken, getProfile)
router.post('/refresh',authenticateToken, refreshToken)

module.exports = router