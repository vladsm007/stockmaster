const prisma = require('../../infrastructure/database/database.js')

//Criando o usuario
const createUser = async (req, res) =>{
   try {

    const {
      name,
      email,
      password,
      role
    } = req.body

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'Nome, email e senha são obrigatórios.' })
    }

     const user = await prisma.user.create({
        data: {
            name,
            email,
            password,
            role
        }
    })
    console.log('usuario cadastrado com sucesso',user)
    return user
   } catch (error) {
     console.error('Erro ao criar usuário:', error)

     // Tratamento de erro para email duplicado
     if (error.code === 'P2002') {
       return res.status(400).json({ error: 'Email já está em uso.' })
   }
   res.status(500).json({ error: 'Erro interno do servidor.' });
  }
}

const getAllUsers = async () => {
  try {
    const users = await prisma.user.findMany({})
    return users
  } catch (error) {
    console.error('Erro ao criar usuário:', error)

  }  
}

const getUserById = () => {
    console.log('buscando usuario pela id')
  }

  const updateUserById = () => {
    console.log('buscando usuario pela id')
  }

  const deleteUser = () => {
    console.log('buscando usuario pela id')
  }
module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUserById,
    deleteUser
}