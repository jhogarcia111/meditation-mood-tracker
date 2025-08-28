import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyToken } from '@/lib/auth'

const prisma = new PrismaClient()

// Forzar renderizado dinámico
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
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

    // Obtener todos los registros del usuario
    const records = await prisma.dailyRecord.findMany({
      where: { userId: decoded.id },
      include: {
        feelingRatings: {
          include: {
            feeling: true,
          },
        },
      },
      orderBy: { date: 'desc' },
    })

    // Calcular estadísticas
    const totalRecords = records.length
    
    let totalBeforeRating = 0
    let totalAfterRating = 0
    let totalImprovement = 0
    let recordsWithImprovement = 0

    records.forEach(record => {
      const beforeRatings = record.feelingRatings
        .filter(r => r.beforeRating !== null)
        .map(r => r.beforeRating)
      
      const afterRatings = record.feelingRatings
        .filter(r => r.afterRating !== null)
        .map(r => r.afterRating)

      if (beforeRatings.length > 0 && afterRatings.length > 0) {
        const avgBefore = beforeRatings.reduce((a, b) => a + b, 0) / beforeRatings.length
        const avgAfter = afterRatings.reduce((a, b) => a + b, 0) / afterRatings.length
        
        totalBeforeRating += avgBefore
        totalAfterRating += avgAfter
        
        if (avgAfter > avgBefore) {
          const improvement = ((avgAfter - avgBefore) / avgBefore) * 100
          totalImprovement += improvement
          recordsWithImprovement++
        }
      }
    })

    const averageBeforeRating = totalRecords > 0 ? totalBeforeRating / totalRecords : 0
    const averageAfterRating = totalRecords > 0 ? totalAfterRating / totalRecords : 0
    const averageImprovement = recordsWithImprovement > 0 ? totalImprovement / recordsWithImprovement : 0

    // Obtener registros recientes (últimos 7 días)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const recentRecords = records.filter(record => 
      new Date(record.date) >= sevenDaysAgo
    )

    // Obtener sentimientos más frecuentes
    const feelingStats = await prisma.feelingRating.groupBy({
      by: ['feelingId'],
      where: {
        dailyRecord: {
          userId: decoded.id,
        },
      },
      _count: {
        feelingId: true,
      },
      orderBy: {
        _count: {
          feelingId: 'desc',
        },
      },
      take: 5,
    })

    const topFeelings = await Promise.all(
      feelingStats.map(async (stat) => {
        const feeling = await prisma.feeling.findUnique({
          where: { id: stat.feelingId },
        })
        return {
          feeling,
          count: stat._count.feelingId,
        }
      })
    )

    return NextResponse.json({
      totalRecords,
      averageBeforeRating: Math.round(averageBeforeRating * 10) / 10,
      averageAfterRating: Math.round(averageAfterRating * 10) / 10,
      averageImprovement: Math.round(averageImprovement * 10) / 10,
      recentRecords: recentRecords.length,
      topFeelings,
      records: records.slice(0, 10), // Últimos 10 registros
    })
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
