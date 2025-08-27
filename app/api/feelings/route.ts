import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const feelings = await prisma.feeling.findMany({
      where: {
        isActive: true,
      },
    })

    // Función para mezclar array aleatoriamente
    const shuffleArray = (array: any[]) => {
      const shuffled = [...array]
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
      }
      return shuffled
    }

    // Devolver sentimientos en orden aleatorio
    const shuffledFeelings = shuffleArray(feelings)

    return NextResponse.json(shuffledFeelings)
  } catch (error) {
    console.error('Error obteniendo sentimientos:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
