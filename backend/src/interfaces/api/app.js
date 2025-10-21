const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')

const userRoutes = require('../../web/routes/UserRoutes.js')
const app = express()

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes - CORREÇÃO: "indowMs" para "windowMs"
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-8', 
    legacyHeaders: false,
    ipv6Subnet: 56,
})

// Middlewares
app.use(cors())
app.use(helmet())
app.use(express.json())
app.use(limiter) // ✅ CORREÇÃO: Use a instância limiter como middleware global

// Health check
app.get('/health', (req, res) => { // ✅ REMOVIDO: .use(rateLimit) incorreto
  res.json({ status: 'ok', timestamp: new Date() });
});

// Routes
app.use('/api/v1/users', userRoutes) // ✅ REMOVIDO: .use(rateLimit) incorreto

// Error handler - CORREÇÃO: "nest" para "next"
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error'
    })
})

module.exports = app