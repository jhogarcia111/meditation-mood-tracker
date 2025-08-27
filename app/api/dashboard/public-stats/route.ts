import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    // Obtener datos de actividad por día (últimos 7 días)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const activityLogs = await prisma.activityLog.findMany({
      where: {
        createdAt: {
          gte: sevenDaysAgo
        }
      },
      orderBy: { createdAt: 'asc' }
    })

    // Agrupar actividad por día
    const activityByDay: { [key: string]: number } = {}
    
    activityLogs.forEach(log => {
      const date = log.createdAt.toISOString().slice(0, 10)
      activityByDay[date] = (activityByDay[date] || 0) + 1
    })

    const activityData = Object.entries(activityByDay).map(([date, count]) => ({
      date: new Date(date).toLocaleDateString('es-ES', { 
        month: 'short', 
        day: 'numeric' 
      }),
      activities: count
    }))

    // Obtener datos de cambios promedio en sentimientos
    const feelingRatings = await prisma.feelingRating.findMany({
      include: {
        feeling: true
      }
    })

    const feelingChanges: { [key: string]: { before: number[], after: number[] } } = {}
    
    feelingRatings.forEach(rating => {
      const feelingName = rating.feeling.nameEs
      if (!feelingChanges[feelingName]) {
        feelingChanges[feelingName] = { before: [], after: [] }
      }
      feelingChanges[feelingName].before.push(rating.beforeRating)
      feelingChanges[feelingName].after.push(rating.afterRating)
    })

    const feelingChangesData = Object.entries(feelingChanges).map(([feelingName, data]) => {
      const avgBefore = data.before.reduce((a, b) => a + b, 0) / data.before.length
      const avgAfter = data.after.reduce((a, b) => a + b, 0) / data.after.length
      return {
        feeling: feelingName,
        antes: Math.round(avgBefore * 10) / 10,
        después: Math.round(avgAfter * 10) / 10,
        diferencia: Math.round((avgAfter - avgBefore) * 10) / 10
      }
    })

    return NextResponse.json({
      activityData,
      feelingChanges: feelingChangesData
    })
  } catch (error) {
    console.error('Error obteniendo estadísticas públicas:', error)
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 })
  }
}
