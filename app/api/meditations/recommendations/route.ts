import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { beforeFeelings, moodDescription } = body

    // Obtener todas las meditaciones activas con sus etiquetas
    const meditations = await prisma.meditation.findMany({
      where: {
        isActive: true,
      },
      include: {
        tags: true,
      },
    })

    // Analizar sentimientos negativos para determinar qué tipo de meditación recomendar
    const badFeelings = Object.entries(beforeFeelings || {})
      .filter(([feelingId, rating]) => {
        // Aquí necesitarías obtener el feeling para verificar si es BAD
        // Por ahora, asumimos que ratings altos (6+) indican sentimientos negativos fuertes
        return rating >= 6
      })

    const recommendations = []

    // Si hay sentimientos negativos fuertes, recomendar meditaciones de relajación
    if (badFeelings.length > 0) {
      const relaxationMeditations = meditations.filter(meditation =>
        meditation.tags.some(tag =>
          ['ansiedad', 'estrés', 'relajación', 'calma', 'respiración'].includes(tag.name.toLowerCase())
        )
      )
      recommendations.push(...relaxationMeditations.slice(0, 2))
    }

    // Si hay mención de tensión o estrés en la descripción
    if (moodDescription && (
      moodDescription.toLowerCase().includes('tensión') ||
      moodDescription.toLowerCase().includes('estrés') ||
      moodDescription.toLowerCase().includes('ansiedad')
    )) {
      const stressMeditations = meditations.filter(meditation =>
        meditation.tags.some(tag =>
          ['estrés', 'tensión', 'ansiedad', 'respiración'].includes(tag.name.toLowerCase())
        )
      )
      recommendations.push(...stressMeditations.slice(0, 2))
    }

    // Si no hay recomendaciones específicas, agregar meditaciones generales
    if (recommendations.length === 0) {
      const generalMeditations = meditations.filter(meditation =>
        meditation.tags.some(tag =>
          ['general', 'mindfulness', 'bienestar'].includes(tag.name.toLowerCase())
        )
      )
      recommendations.push(...generalMeditations.slice(0, 3))
    }

    // Si aún no hay recomendaciones, tomar las primeras 3 meditaciones
    if (recommendations.length === 0) {
      recommendations.push(...meditations.slice(0, 3))
    }

    // Eliminar duplicados y limitar a 3 recomendaciones
    const uniqueRecommendations = recommendations
      .filter((meditation, index, self) => 
        index === self.findIndex(m => m.id === meditation.id)
      )
      .slice(0, 3)

    return NextResponse.json(uniqueRecommendations)
  } catch (error) {
    console.error('Error obteniendo recomendaciones:', error)
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 })
  }
}
