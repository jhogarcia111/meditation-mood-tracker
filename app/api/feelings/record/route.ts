import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyToken } from '@/lib/auth'
import { logActivity } from '@/lib/activity-logger'

const prisma = new PrismaClient()

// Forzar renderizado dinámico
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json(
        { message: 'Token de autenticación requerido' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json(
        { message: 'Token inválido' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      date,
      beforeFeelings,
      moodDescription,
      selectedMeditation,
      afterFeelings,
      postMeditationNotes,
    } = body

    // Crear nuevo registro (permitir múltiples por día)
    const dailyRecord = await prisma.dailyRecord.create({
      data: {
        userId: decoded.id,
        date: new Date(date),
        meditationType: selectedMeditation || null,
        meditationNotes: postMeditationNotes || null,
      },
    })

    // Crear las calificaciones de sentimientos antes
    const beforeRatings = Object.entries(beforeFeelings || {}).map(([feelingId, rating]) => ({
      dailyRecordId: dailyRecord.id,
      feelingId,
      beforeRating: rating as number,
      afterRating: null,
    }))

    // Crear las calificaciones de sentimientos después
    const afterRatings = Object.entries(afterFeelings || {}).map(([feelingId, rating]) => ({
      dailyRecordId: dailyRecord.id,
      feelingId,
      beforeRating: null,
      afterRating: rating as number,
    }))

    // Combinar y crear todas las calificaciones
    const allRatings = beforeRatings.map((before, index) => ({
      ...before,
      afterRating: afterRatings[index]?.afterRating || 0,
    }))

    await prisma.feelingRating.createMany({
      data: allRatings,
    })

    // Registrar la actividad
    await logActivity(decoded.id, 'CREATE_RECORD', JSON.stringify({
      recordId: dailyRecord.id,
      date,
      hasMeditation: !!selectedMeditation,
    }))

    return NextResponse.json({
      message: 'Registro guardado exitosamente',
      recordId: dailyRecord.id,
    })
  } catch (error) {
    console.error('Error guardando registro:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
