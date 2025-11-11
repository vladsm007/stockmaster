const { verifyToken } = require('../../infrastructure/auth/jwt');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      error: 'Token de acesso não fornecido.' 
    });
  }

  try {
    const decoded = verifyToken(token);
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    console.error('Invalid or expired token:', error);
    return res.status(403).json({ 
      error: 'Token inválido ou expirado.' 
    });
  }
};

// Middleware para verificar roles específicas
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.userRole)) {
      return res.status(403).json({ 
        error: 'Acesso negado. Permissões insuficientes.' 
      });
    }
    next();
  };
};

// Middleware opcional para rotas públicas/privadas
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (token) {
    try {
      const decoded = verifyToken(token);
      req.userId = decoded.userId;
      req.userRole = decoded.role;
    } catch (error) {
      // Token inválido, mas a rota continua (opcional)
      console.warn('optionalAuth: token inválido ou expirado:', error?.message ?? error);
      // Garantir que não haja dados de autenticação antigos
      delete req.userId;
      delete req.userRole;
      // Opcional: expor o erro para handlers posteriores, se necessário
      req.authError = error;
    }
  }
  next();
};

module.exports = {
  authenticateToken,
  authorize,
  optionalAuth
};