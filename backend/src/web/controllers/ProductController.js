const prisma = require('../../infrastructure/database/database.js')


// Função para formatar produtos convertendo campos Decimal
function formatProduct(product) {
  if (!product) return product;
  
  return {
    ...product,
    unitPrice: product.unitPrice ? Number(product.unitPrice) : null,
    // Se houver outros campos decimal, adicione aqui também
    // exemplo: discount: product.discount ? Number(product.discount) : null
  };
}

// Função para formatar array de produtos
function formatProducts(products) {
  return products.map(product => formatProduct(product));
}

// Criando produto
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description, 
      sku, 
      barcode,
      currentStock,
      unitPrice,
      categoryId,
      supplierId,
      imageUrl,
      active,
    } = req.body

    if (!name || !sku || !barcode || !supplierId || !categoryId) {
      return res.status(400).json({ 
        error: 'Nome, sku, barcode, categoryId e supplierId são obrigatórios.' 
      })
    }

    const product = await prisma.product.create({
      data: {
        name,
        description: description || "",
        sku, 
        barcode: String(barcode), // Garantir que seja string
        currentStock: parseInt(currentStock) || 0,
        unitPrice: parseFloat(unitPrice) || 0,
        categoryId: parseInt(categoryId),
        supplierId: parseInt(supplierId),
        imageUrl: imageUrl || null,
        active: active !== undefined ? active : true,
      }
    })

    console.log('✅ Produto cadastrado com sucesso:', product.id)
    res.status(201).json(formatProduct(product))

  } catch (error) {
    console.error('❌ Erro ao criar produto:', error)
    
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'SKU já existe' })
    }
    if (error.code === 'P2003') {
      return res.status(400).json({ error: 'CategoryId ou SupplierId inválido' })
    }
    
    res.status(500).json({ error: 'Erro interno do servidor.' })
  }
}

const getAllProducts = async (req, res) => {
  try {
    console.log('📋 Buscando todos produtos')
    
    const products = await prisma.product.findMany({
      where: {
        deletedAt: null
      },
      include: {
        category: true, // Inclui dados da categoria
        supplier: true  // Inclui dados do fornecedor
      }
    })

    console.log(`✅ ${products.length} produtos encontrados.`)
    res.json(formatProducts(products))

  } catch (error) {
    console.error('❌ Erro ao buscar produtos:', error)
    res.status(500).json({ error: 'Erro interno do servidor.' })
  }  
}

const getProductById = async (req, res) => {
  try {
    const { id } = req.params
    console.log(`👤 Buscando produto ID: ${id}`)

    const product = await prisma.product.findFirst({
      where: {
        id: parseInt(id),
        deletedAt: null
      },
      include: {
        category: true,
        supplier: true
      }
    })

    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' })
    }

    res.json(product)

  } catch (error) {
    console.error('❌ Erro ao buscar produto:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

// Buscar produto por SKU
const getProductBySKU = async (req, res) => {
  try {
    const { sku } = req.params
    console.log(`👤 Buscando produto SKU: ${sku}`)

    const product = await prisma.product.findFirst({
      where: {
        sku: sku,
        deletedAt: null
      },
      include: {
        category: true,
        supplier: true
      }
    })

    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' })
    }

    res.json(product)

  } catch (error) {
    console.error('❌ Erro ao buscar produto:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

const updateProductById = async (req, res) => {
  try {
    const { id } = req.params
    const {
      name,
      description,
      barcode,
      currentStock,
      unitPrice,
      categoryId,
      supplierId,
      imageUrl,
      active
    } = req.body

    console.log(`✏️ Atualizando produto ID: ${id}`)

    // Verificar se produto existe
    const existingProduct = await prisma.product.findFirst({
      where: {
        id: parseInt(id),
        deletedAt: null
      }
    })

    if (!existingProduct) {
      return res.status(404).json({ error: 'Produto não encontrado' })
    }

    const product = await prisma.product.update({
      where: {
        id: parseInt(id)
      },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(barcode && { barcode: String(barcode) }),
        ...(currentStock && { currentStock: parseInt(currentStock) }),
        ...(unitPrice && { unitPrice: parseFloat(unitPrice) }),
        ...(categoryId && { categoryId: parseInt(categoryId) }),
        ...(supplierId && { supplierId: parseInt(supplierId) }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(active !== undefined && { active }),
        updatedAt: new Date()
      },
      include: {
        category: true,
        supplier: true
      }
    })

    console.log('✅ Produto atualizado')
    res.json(product)

  } catch (error) {
    console.error('❌ Erro ao atualizar produto:', error)
    
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Produto não encontrado' })
    }
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'SKU já existe' })
    }
    if (error.code === 'P2003') {
      return res.status(400).json({ error: 'CategoryId ou SupplierId inválido' })
    }
    
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params
    console.log(`🗑️ Deletando produto ID: ${id}`)

    // Verificar se produto existe
    const existingProduct = await prisma.product.findFirst({
      where: {
        id: parseInt(id),
        deletedAt: null
      }
    })

    if (!existingProduct) {
      return res.status(404).json({ error: 'Produto não encontrado' })
    }

    // Soft delete
    await prisma.product.update({
      where: {
        id: parseInt(id)
      },
      data: {
        deletedAt: new Date(),
        active: false // Opcional: marcar como inativo também
      }
    })

    console.log('✅ Produto deletado.')
    res.status(204).send()

  } catch (error) {
    console.error('❌ Erro ao deletar produto:', error)
    
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Produto não encontrado' })
    }
    
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  getProductBySKU,
  updateProductById,
  deleteProduct
}