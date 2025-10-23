const prisma = require('../../infrastructure/database/database.js')

//Criando categoria
const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body

        if(!name) {
            return res.status(400).json({ error: 'Nome é obrigatório'})
        }

        const category = await prisma.category.create({
            data: {
                name,
                description
            }
        })
        console.log('✅ Categoria cadastrada com sucesso:', category.id)
            res.status(201).json(category)
    } catch (error) {
        console.error('❌ Erro ao criar a categoria:', error)
    }
}

const getAllCategories = async (req, res) => {
    try {
        console.log('📋 Buscando todas categorias')

        const categories = await prisma.category.findMany({
            where: {
                deletedAt: null // Não retorna categorias deletadas
            },
            select: {
                id: true,
                name: true,
            }
        })
        console.log(`✅ ${categories.length} categorias encontradas`)
        res.json(categories)
    } catch (error) {
        console.error('❌ Erro ao buscar as categorias:', error)
        res.status(500).json({ error: 'Erro interno do servidor.' })
  
    }
}

const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params
        console.log(`📋 Buscando categoria ID: ${id}`)

        const category = await prisma.category.findFirst({
            where: {
                id: parseInt(id),
                deletedAt: null
            },
            select: {
                id: true,
                name: true,
                description: true,
                createdAt: true
            }
        })

        if (!category) {
                  return res.status(404).json({ error: 'Usuário não encontrado' })
        }

        res.json(category)
    } catch (error) {
        console.error('❌ Erro ao buscar a categoria:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
    }
}


const updateCategory = async (req, res) => {
    try {
        const { id } = req.params
        const { name, description } = req.body

        console.log(`✏️ Atualizando categoria ID: ${id}`)

        const category = await prisma.category.update({
            where: {
                id: parseInt(id),
                deletedAt: null
            },
            data: {
                ...(name && { name }),
                ...(description && { description })
            }
        })

        console.log('✅ Categoria atualizada')
        res.json(category)
        
    } catch (error) {
        console.error('❌ Erro ao atualizar categoria:', error)
            res.status(500).json({ error: 'Erro interno do servidor' })

    }
}

const deleteCategory = async (req, res) => {
try {
    const { id } = req.params
    console.log(`🗑️ Deletando categoria ID: ${id}`)

    // Soft delete (marca como deletado)
    await prisma.category.update({
        where: {
            id: parseInt(id)
        },
        data: {
            deletedAt: new Date()
        }
    })

    console.log('✅ Categoria deletada')
    res.status(204).send()
} catch (error) {
    console.error('❌ Erro ao deletar categoria:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
}
}

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
}