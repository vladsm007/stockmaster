const prisma = require('../../infrastructure/database/database.js')

// Criando o usuario
const createSupplier = async (req, res) => {
  try {
    const { 
      name, 
      contactName, 
      email, 
      phone, 
      address,
      city,
      state,
      zipCode,
      active
    } = req.body

    if (!name || !contactName || !email || !phone) {
      return res.status(400).json({ error: 'Nome, nome do contato email e telefone são obrigatórios.' })
    }

    const supplier = await prisma.supplier.create({
      data: {
        name, 
        contactName, 
        email, 
        phone, 
        address,
        city,
        state,
        zipCode,
        active
      }
    })

    console.log('✅ Fornecedor cadastrado com sucesso:', supplier.id)
    res.status(201).json(supplier)

  } catch (error) {
    console.error('❌ Erro ao criar usuário:', error)

    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Email já está em uso.' })
    }
    res.status(500).json({ error: 'Erro interno do servidor.' })
  }
}

const getAllSuppliers = async (req, res) => {
  try {
    console.log('📋 Buscando todos fornecedores')
    
    const suppliers = await prisma.supplier.findMany({
      where: {
        deletedAt: null // Não retorna usuários deletados
      },
      select: {
        name: true,
        contactName: true,
        email: true,
        phone: true,
        address: true,
        city: true,
        state: true,
        zipCode: true,
        active: true,
        createdAt: true
      }
    })

    console.log(`✅ ${suppliers.length} fornecedores encontrados`)
    res.json(suppliers)

  } catch (error) {
    console.error('❌ Erro ao buscar fornecedores:', error)
    res.status(500).json({ error: 'Erro interno do servidor.' })
  }  
}

const getSupplierById = async (req, res) => {
  try {
    const { id } = req.params
    console.log(`👤 Buscando fornecedor ID: ${id}`)

    const supplier = await prisma.supplier.findFirst({
      where: {
        id: parseInt(id),
        deletedAt: null
      },
      select: {
        name: true,
        contactName: true,
        email: true,
        phone: true,
        address: true,
        city: true,
        state: true,
        zipCode: true,
        active: true,
        createdAt: true
      }
    })

    if (!supplier) {
      return res.status(404).json({ error: 'Fornecedor não encontrado' })
    }

    res.json(supplier)

  } catch (error) {
    console.error('❌ Erro ao buscar fornecedor:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

const updateSupplierById = async (req, res) => {
  try {
    const { id } = req.params
    const { 
        name, 
        contactName, 
        email, 
        phone, 
        address,
        city,
        state,
        zipCode,
        active
    } = req.body

    console.log(`✏️ Atualizando fornecedor ID: ${id}`)

    const supplier = await prisma.supplier.update({
      where: {
        id: parseInt(id),
        deletedAt: null
      },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(contactName && { contactName }),
        ...(phone && { phone }),
        ...(address && { address }),
        ...(city && { city }),
        ...(state && { state }),
        ...(zipCode && { zipCode }),
        ...(active && { active })
      }
    })

    console.log('✅ Fornecedor atualizado')
    res.json(supplier)

  } catch (error) {
    console.error('❌ Erro ao atualizar usuário:', error)
    
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Fornecedor não encontrado' })
    }
    
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

const deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params
    console.log(`🗑️ Deletando Fornecedor ID: ${id}`)

    // Soft delete (marca como deletado)
    await prisma.supplier.update({
      where: {
        id: parseInt(id)
      },
      data: {
        deletedAt: new Date()
      }
    })

    console.log('✅ Fornecedor deletado')
    res.status(204).send()

  } catch (error) {
    console.error('❌ Erro ao deletar fornecedor:', error)
    
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Fornecedor não encontrado' })
    }
    
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

module.exports = {
  createSupplier,
  getAllSuppliers,
  getSupplierById,
  updateSupplierById,
  deleteSupplier
}