const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const bigIntMiddleware = require('../../web/middleware/BigInt.js')

const prisma = require('../../infrastructure/database/database.js')
const authRoutes = require('../../web/routes/authRoutes.js')
const userRoutes = require('../../web/routes/UserRoutes.js')
const categoryRoutes = require('../../web/routes/CategoryRoutes.js')
const supplierRoutes = require('../../web/routes/SupplierRoutes.js')
const productRoutes = require('../../web/routes/ProductRouter.js')

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
app.use(limiter)
app.use(bigIntMiddleware)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// Health check banco de dados
app.get('/db-health', async (req, res) => {
  try {
    // Tenta uma consulta simples no banco
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ 
      status: 'OK', 
      database: 'Conectado com sucesso' 
    });
  } catch (error) {
    console.error('Erro de conexão com o banco:', error);
    res.status(500).json({ 
      status: 'Erro', 
      database: 'Conexão falhou' 
    });
  }
});

// Routes
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/categories', categoryRoutes)
app.use('/api/v1/suppliers', supplierRoutes)
app.use('/api/v1/products', productRoutes)
app.use('/api/v1/auth', authRoutes)

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error'
    })
})

module.exports = app