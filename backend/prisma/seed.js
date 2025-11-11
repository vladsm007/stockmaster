
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {

  // Crie dados iniciais
  await prisma.user.createMany({
    data: [
      { name: 'Admin',
        email: 'admin@example.com',
        password: 'senha123',
        role: 'ADMIN'
     }
    ],
  });
  console.log(`✅ ${users.count} usuários criados com sucesso!`);
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });