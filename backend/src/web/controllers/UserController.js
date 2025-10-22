const prisma = require('../../infrastructure/database/database.js')

// Criando o usuario
const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nome, email e senha são obrigatórios.' })
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
        role: role || 'OPERATOR' // role não é obrigatório no schema
      }
    })

    console.log('✅ Usuário cadastrado com sucesso:', user.id)
    res.status(201).json(user)

  } catch (error) {
    console.error('❌ Erro ao criar usuário:', error)

    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Email já está em uso.' })
    }
    res.status(500).json({ error: 'Erro interno do servidor.' })
  }
}

const getAllUsers = async (req, res) => {
  try {
    console.log('📋 Buscando todos usuários')
    
    const users = await prisma.user.findMany({
      where: {
        deletedAt: null // Não retorna usuários deletados
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
        // Não retornar password por segurança
      }
    })

    console.log(`✅ ${users.length} usuários encontrados`)
    res.json(users)

  } catch (error) {
    console.error('❌ Erro ao buscar usuários:', error)
    res.status(500).json({ error: 'Erro interno do servidor.' })
  }  
}

const getUserById = async (req, res) => {
  try {
    const { id } = req.params
    console.log(`👤 Buscando usuário ID: ${id}`)

    const user = await prisma.user.findFirst({
      where: {
        id: parseInt(id),
        deletedAt: null
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    })

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' })
    }

    res.json(user)

  } catch (error) {
    console.error('❌ Erro ao buscar usuário:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

const updateUserById = async (req, res) => {
  try {
    const { id } = req.params
    const { name, email, role } = req.body

    console.log(`✏️ Atualizando usuário ID: ${id}`)

    const user = await prisma.user.update({
      where: {
        id: parseInt(id),
        deletedAt: null
      },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(role && { role })
      }
    })

    console.log('✅ Usuário atualizado')
    res.json(user)

  } catch (error) {
    console.error('❌ Erro ao atualizar usuário:', error)
    
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Usuário não encontrado' })
    }
    
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params
    console.log(`🗑️ Deletando usuário ID: ${id}`)

    // Soft delete (marca como deletado)
    await prisma.user.update({
      where: {
        id: parseInt(id)
      },
      data: {
        deletedAt: new Date()
      }
    })

    console.log('✅ Usuário marcado como deletado')
    res.status(204).send()

  } catch (error) {
    console.error('❌ Erro ao deletar usuário:', error)
    
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Usuário não encontrado' })
    }
    
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUser
}