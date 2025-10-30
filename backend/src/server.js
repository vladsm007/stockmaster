require('dotenv').config()
const app = require('./interfaces/api/app.js')
const PORT = process.env.PORT || 3001
const HOST = process.env.HOST || 'localhost'

let server

async function startServer() {
    try {
        server = app.listen(PORT, HOST, () => {
            console.log(`🚀 Servidor rodando em http://${HOST}:${PORT}`)
        })

        //Tratamento de erro do servidor
        server.on('error', (error) => {
            throw error
        })

        // Graceful shutdown
        process.on('SIGTERM', gracefulShutdown);
        process.on('SIGINT', gracefulShutdown);
    } catch (error) {
        console.error('❌ Erro ao iniciar servidor:', error.message)

        if(error.code === 'EADDRINUSE') {
            console.error(`🔌 Porta ${PORT} ocupada. Use: kill -9 $(lsof -t -i:${PORT})`)
        }
        process.exit(1)
    }
}

function gracefulShutdown() {
    console.log('\n🛑 Desligando servidor graciosamente...');
    if (server) {
        server.close(() => {
            console.log('✅ Servidor desligado');
            process.exit(0);
        });
        
        // Force close após 5 segundos
        setTimeout(() => {
            console.log('⚠️  Desligamento forçado');
            process.exit(1);
        }, 5000);
    }
}


 startServer()
 
module.exports = app