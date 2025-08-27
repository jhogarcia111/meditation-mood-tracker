import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 Verificando sentimientos en la base de datos...')

  try {
    const feelings = await prisma.feeling.findMany({
      select: {
        id: true,
        nameEs: true,
        nameEn: true,
        category: true,
        isActive: true,
        createdAt: true,
      },
    })

    console.log(`\n📊 Total de sentimientos encontrados: ${feelings.length}`)
    
    if (feelings.length === 0) {
      console.log('❌ No hay sentimientos en la base de datos')
    } else {
      console.log('\n💭 Lista de sentimientos:')
      feelings.forEach((feeling, index) => {
        console.log(`${index + 1}. ID: ${feeling.id}`)
        console.log(`   Nombre ES: ${feeling.nameEs}`)
        console.log(`   Nombre EN: ${feeling.nameEn}`)
        console.log(`   Categoría: ${feeling.category}`)
        console.log(`   Activo: ${feeling.isActive}`)
        console.log(`   Creado: ${feeling.createdAt}`)
        console.log('')
      })
    }
  } catch (error) {
    console.error('❌ Error al consultar sentimientos:', error)
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
