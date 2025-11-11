const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'segredo super secreto'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h'

const generateToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET)
    } catch (error) {
        throw new Error('Token inválido ou expirado')
    }
}

const decodeToken = (token) => {
  return jwt.decode(token);
}

module.exports = {
    generateToken,
    verifyToken,
    decodeToken,
    JWT_SECRET
}