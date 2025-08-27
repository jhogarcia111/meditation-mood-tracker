import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyToken } from '@/lib/auth'
import { logActivity } from '@/lib/activity-logger'

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

    // Obtener todos los sentimientos
    const feelings = await prisma.feeling.findMany({
      orderBy: [
        { category: 'asc' },
        { nameEs: 'asc' }
      ]
    })

    return NextResponse.json(feelings)
  } catch (error) {
    console.error('Error obteniendo sentimientos:', error)
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const { nameEs, nameEn, category, isActive } = body

    if (!nameEs || !nameEn || !category) {
      return NextResponse.json({ message: 'Todos los campos son requeridos' }, { status: 400 })
    }

    // Verificar si el sentimiento ya existe
    const existingFeeling = await prisma.feeling.findFirst({
      where: {
        OR: [
          { nameEs },
          { nameEn }
        ]
      }
    })

    if (existingFeeling) {
      return NextResponse.json({ message: 'El sentimiento ya existe' }, { status: 400 })
    }

    // Crear sentimiento
    const newFeeling = await prisma.feeling.create({
      data: {
        nameEs,
        nameEn,
        category,
        isActive: isActive !== undefined ? isActive : true
      }
    })

    await logActivity(decoded.id, 'CREATE_FEELING', `Sentimiento creado: ${newFeeling.nameEs}`)

    return NextResponse.json(newFeeling, { status: 201 })
  } catch (error) {
    console.error('Error creando sentimiento:', error)
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 })
  }
}
