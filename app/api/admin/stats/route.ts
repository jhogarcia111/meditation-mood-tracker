import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyToken } from '@/lib/auth'

const prisma = new PrismaClient()

// Forzar renderizado dinámico
export const dynamic = 'force-dynamic'

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

    // Obtener estadísticas en paralelo para mejor rendimiento
    const [
      activeFeelings,
      meditations,
      tags,
      users
    ] = await Promise.all([
      prisma.feeling.count({ where: { isActive: true } }),
      prisma.meditation.count({ where: { isActive: true } }),
      prisma.meditationTag.count({ where: { isActive: true } }),
      prisma.user.count()
    ])

    return NextResponse.json({
      activeFeelings,
      meditations,
      tags,
      users
    })
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error)
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 })
  }
}
