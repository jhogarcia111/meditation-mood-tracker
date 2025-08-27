import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🧹 Limpiando sentimientos duplicados...')

  try {
    // Obtener todos los sentimientos
    const allFeelings = await prisma.feeling.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    })

    console.log(`📊 Total de sentimientos encontrados: ${allFeelings.length}`)

    // Agrupar por nombre en español
    const groupedFeelings = allFeelings.reduce((acc, feeling) => {
      if (!acc[feeling.nameEs]) {
        acc[feeling.nameEs] = []
      }
      acc[feeling.nameEs].push(feeling)
      return acc
    }, {} as Record<string, typeof allFeelings>)

    // Encontrar duplicados
    const duplicates = Object.entries(groupedFeelings)
      .filter(([name, feelings]) => feelings.length > 1)
      .map(([name, feelings]) => ({
        name,
        count: feelings.length,
        feelings: feelings.slice(1), // Mantener el primero, eliminar el resto
      }))

    console.log(`🔍 Encontrados ${duplicates.length} sentimientos con duplicados:`)
    duplicates.forEach(({ name, count }) => {
      console.log(`   - ${name}: ${count} copias`)
    })

    // Eliminar duplicados (mantener el más antiguo)
    let deletedCount = 0
    for (const { feelings } of duplicates) {
      for (const feeling of feelings) {
        await prisma.feeling.delete({
          where: { id: feeling.id },
        })
        deletedCount++
      }
    }

    console.log(`✅ Eliminados ${deletedCount} sentimientos duplicados`)

    // Verificar resultado final
    const finalFeelings = await prisma.feeling.findMany({
      orderBy: {
        category: 'asc',
        nameEs: 'asc',
      },
    })

    console.log(`\n📋 Sentimientos únicos restantes (${finalFeelings.length}):`)
    finalFeelings.forEach((feeling, index) => {
      console.log(`${index + 1}. ${feeling.nameEs} (${feeling.category})`)
    })

  } catch (error) {
    console.error('❌ Error limpiando duplicados:', error)
  }
}

main()
  .catch((e) => {
    console.error('❌ Error durante la limpieza:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
