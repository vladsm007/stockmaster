const prisma = require('../../infrastructure/database/database');
const { comparePassword } = require('../../infrastructure/auth/PasswordAuth');
const { generateToken } = require('../../infrastructure/auth/jwt');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validação básica
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email e senha são obrigatórios.' 
      });
    }

    // Buscar usuário
    const user = await prisma.user.findFirst({
      where: { 
        email,
        deletedAt: null 
      }
    });

    if (!user) {
      return res.status(401).json({ 
        error: 'Credenciais inválidas.' 
      });
    }

    // Verificar senha
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        error: 'Credenciais inválidas.' 
      });
    }

    // Gerar token JWT
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    // Remover senha do retorno
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      user: userWithoutPassword,
      token,
      expiresIn: '1h'
    });

  } catch (error) {
    console.error('❌ Erro no login:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor.' 
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findFirst({
      where: { 
        id: req.userId,
        deletedAt: null 
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ 
        error: 'Usuário não encontrado.' 
      });
    }

    res.json(user);
  } catch (error) {
    console.error('❌ Erro ao buscar perfil:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor.' 
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    // Buscar usuário atual
    const user = await prisma.user.findFirst({
      where: { 
        id: req.userId,
        deletedAt: null 
      },
      select: {
        id: true,
        email: true,
        role: true
      }
    });

    if (!user) {
      return res.status(404).json({ 
        error: 'Usuário não encontrado.' 
      });
    }

    // Gerar novo token
    const newToken = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    res.json({
      token: newToken,
      expiresIn: '1h'
    });

  } catch (error) {
    console.error('❌ Erro ao renovar token:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor.' 
    });
  }
};

module.exports = {
  login,
  getProfile,
  refreshToken
};