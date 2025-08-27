import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 Verificando usuarios en la base de datos...')

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        userId: true,
        email: true,
        role: true,
        createdAt: true,
      },
    })

    console.log(`\n📊 Total de usuarios encontrados: ${users.length}`)
    
    if (users.length === 0) {
      console.log('❌ No hay usuarios en la base de datos')
    } else {
      console.log('\n👥 Lista de usuarios:')
      users.forEach((user, index) => {
        console.log(`${index + 1}. ID: ${user.id}`)
        console.log(`   UserID: ${user.userId}`)
        console.log(`   Email: ${user.email}`)
        console.log(`   Role: ${user.role}`)
        console.log(`   Creado: ${user.createdAt}`)
        console.log('')
      })
    }
  } catch (error) {
    console.error('❌ Error al consultar usuarios:', error)
  }
}

main()
  .catch((e) => {
    console.error('❌ Error durante la verificación:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
