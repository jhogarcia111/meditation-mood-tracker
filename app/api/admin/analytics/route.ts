import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyToken } from '@/lib/auth'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ message: 'Token requerido' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ message: 'Token inválido' }, { status: 401 })
    }

    // Verificar que sea admin
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { role: true }
    })

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Acceso denegado' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('timeRange') || '7d'

    // Calcular fecha de inicio basada en el rango de tiempo
    const now = new Date()
    let startDate = new Date()
    switch (timeRange) {
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '30d':
        startDate.setDate(now.getDate() - 30)
        break
      case '90d':
        startDate.setDate(now.getDate() - 90)
        break
      default:
        startDate.setDate(now.getDate() - 7)
    }

    // Obtener estadísticas básicas
    const totalUsers = await prisma.user.count()
    const totalRecords = await prisma.dailyRecord.count()
    const totalFeelings = await prisma.feeling.count()
    const activeFeelings = await prisma.feeling.count({ where: { isActive: true } })

    // Usuarios por país
    const usersByCountry = await prisma.user.groupBy({
      by: ['country'],
      _count: { country: true },
      where: { country: { not: null } }
    })

    // Actividad reciente por día
    const activityLogs = await prisma.activityLog.findMany({
      where: {
        createdAt: {
          gte: startDate
        }
      },
      include: {
        user: {
          select: { userId: true }
        }
      },
      orderBy: { createdAt: 'asc' }
    })

    // Agrupar actividad por día y usuario
    const activityByDay: { [key: string]: { total: number, users: { [key: string]: number } } } = {}
    
    activityLogs.forEach(log => {
      const date = log.createdAt.toISOString().slice(0, 10)
      const userId = log.user.userId
      
      if (!activityByDay[date]) {
        activityByDay[date] = { total: 0, users: {} }
      }
      
      activityByDay[date].total++
      activityByDay[date].users[userId] = (activityByDay[date].users[userId] || 0) + 1
    })

    // Convertir a array para las gráficas
    const recentActivity = Object.entries(activityByDay).map(([date, data]) => ({
      date,
      totalActivities: data.total,
      userActivities: data.users
    }))

    // Calcular cambios promedio en sentimientos
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
        feelingName,
        averageBefore: Math.round(avgBefore * 10) / 10,
        averageAfter: Math.round(avgAfter * 10) / 10,
        averageChange: Math.round((avgAfter - avgBefore) * 10) / 10
      }
    })

    // Obtener datos de usuarios registrados por día
    const userRegistrations = await prisma.user.findMany({
      select: {
        createdAt: true
      },
      orderBy: { createdAt: 'asc' }
    })

    const registrationsByDay: { [key: string]: number } = {}
    
    userRegistrations.forEach(user => {
      const date = user.createdAt.toISOString().slice(0, 10)
      registrationsByDay[date] = (registrationsByDay[date] || 0) + 1
    })

    const userRegistrationsData = Object.entries(registrationsByDay).map(([date, count]) => ({
      date,
      registrations: count
    }))

    return NextResponse.json({
      totalUsers,
      totalRecords,
      totalFeelings,
      activeFeelings,
      usersByCountry: usersByCountry.reduce((acc, item) => {
        acc[item.country || 'Unknown'] = item._count.country
        return acc
      }, {} as { [key: string]: number }),
      usersByLanguage: { ES: 0, EN: 0 }, // Simplificado por ahora
      recordsByMonth: {}, // Simplificado por ahora
      recentActivity,
      feelingChanges: feelingChangesData,
      userRegistrations: userRegistrationsData
    })
  } catch (error) {
    console.error('Error obteniendo analíticas:', error)
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 })
  }
}
