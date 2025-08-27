import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Inicializando datos de meditación...')

  // Crear etiquetas de meditación
  const tags = [
    { name: 'Ansiedad', description: 'Para reducir la ansiedad y el nerviosismo' },
    { name: 'Estrés', description: 'Para aliviar el estrés y la tensión' },
    { name: 'Relajación', description: 'Para lograr un estado de relajación profunda' },
    { name: 'Respiración', description: 'Técnicas de respiración consciente' },
    { name: 'Mindfulness', description: 'Meditación de atención plena' },
    { name: 'Sueño', description: 'Para mejorar la calidad del sueño' },
    { name: 'Concentración', description: 'Para mejorar el enfoque y la concentración' },
    { name: 'Gratitud', description: 'Para cultivar sentimientos de gratitud' },
    { name: 'Amor', description: 'Meditación de amor y bondad' },
    { name: 'General', description: 'Meditación general para cualquier estado de ánimo' },
  ]

  console.log('📝 Creando etiquetas...')
  for (const tag of tags) {
    await prisma.meditationTag.upsert({
      where: { name: tag.name },
      update: {},
      create: tag,
    })
  }

  // Obtener las etiquetas creadas
  const createdTags = await prisma.meditationTag.findMany()

  // Crear meditaciones de ejemplo
  const meditations = [
    {
      title: 'Meditación de Respiración Profunda para Ansiedad',
      description: 'Una meditación guiada de 10 minutos para reducir la ansiedad y encontrar calma interior',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      duration: 10,
      tagNames: ['Ansiedad', 'Respiración', 'Relajación']
    },
    {
      title: 'Mindfulness para Principiantes',
      description: 'Meditación mindfulness básica perfecta para quienes están comenzando su práctica',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      duration: 15,
      tagNames: ['Mindfulness', 'General', 'Concentración']
    },
    {
      title: 'Meditación para Dormir Profundamente',
      description: 'Relajación guiada para lograr un sueño reparador y profundo',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      duration: 20,
      tagNames: ['Sueño', 'Relajación', 'Estrés']
    },
    {
      title: 'Meditación de Amor y Bondad',
      description: 'Cultiva sentimientos de amor, compasión y bondad hacia ti mismo y los demás',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      duration: 12,
      tagNames: ['Amor', 'Gratitud', 'General']
    },
    {
      title: 'Meditación para Reducir el Estrés',
      description: 'Técnicas efectivas para liberar la tensión y encontrar paz mental',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      duration: 18,
      tagNames: ['Estrés', 'Relajación', 'Respiración']
    },
    {
      title: 'Meditación de Concentración',
      description: 'Mejora tu enfoque y capacidad de concentración con esta práctica',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      duration: 15,
      tagNames: ['Concentración', 'Mindfulness', 'General']
    }
  ]

  console.log('🧘 Creando meditaciones...')
  for (const meditation of meditations) {
    const tagIds = createdTags
      .filter(tag => meditation.tagNames.includes(tag.name))
      .map(tag => tag.id)

    // Verificar si la meditación ya existe
    const existingMeditation = await prisma.meditation.findFirst({
      where: { title: meditation.title }
    })

    if (existingMeditation) {
      // Actualizar la meditación existente
      await prisma.meditation.update({
        where: { id: existingMeditation.id },
        data: {
          description: meditation.description,
          youtubeUrl: meditation.youtubeUrl,
          duration: meditation.duration,
          tags: {
            set: tagIds.map(id => ({ id }))
          }
        }
      })
    } else {
      // Crear nueva meditación
      await prisma.meditation.create({
        data: {
          title: meditation.title,
          description: meditation.description,
          youtubeUrl: meditation.youtubeUrl,
          duration: meditation.duration,
          tags: {
            connect: tagIds.map(id => ({ id }))
          }
        }
      })
    }
  }

  console.log('✅ Datos de meditación inicializados exitosamente!')
  console.log(`📊 Se crearon ${tags.length} etiquetas y ${meditations.length} meditaciones`)
}

main()
  .catch((e) => {
    console.error('❌ Error inicializando datos:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
