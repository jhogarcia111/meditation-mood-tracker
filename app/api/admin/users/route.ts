import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyToken, hashPassword } from '@/lib/auth'
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

    // Obtener usuarios con estadísticas
    const users = await prisma.user.findMany({
      select: {
        id: true,
        userId: true,
        email: true,
        role: true,
        country: true,
        language: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            dailyRecords: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Transformar datos para incluir estadísticas
    const usersWithStats = users.map(user => ({
      id: user.id,
      userId: user.userId,
      email: user.email,
      role: user.role,
      country: user.country,
      language: user.language,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      totalRecords: user._count.dailyRecords
    }))

    return NextResponse.json(usersWithStats)
  } catch (error) {
    console.error('Error obteniendo usuarios:', error)
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
    const { userId, email, password, role, country, language } = body

    if (!userId || !email || !password) {
      return NextResponse.json({ message: 'Todos los campos son requeridos' }, { status: 400 })
    }

    // Verificar si el userId ya existe
    const existingUser = await prisma.user.findUnique({
      where: { userId }
    })

    if (existingUser) {
      return NextResponse.json({ message: 'El ID de usuario ya existe' }, { status: 400 })
    }

    // Verificar si el email ya existe
    const existingEmail = await prisma.user.findUnique({
      where: { email }
    })

    if (existingEmail) {
      return NextResponse.json({ message: 'El email ya está registrado' }, { status: 400 })
    }

    // Hash de la contraseña
    const hashedPassword = await hashPassword(password)

    // Crear usuario
    const newUser = await prisma.user.create({
      data: {
        userId,
        email,
        password: hashedPassword,
        role: role || 'USER',
        country: country || null,
        language: language || 'ES'
      }
    })

    await logActivity(decoded.id, 'CREATE_USER', `Usuario creado: ${newUser.userId}`)

    // Retornar usuario sin contraseña
    const { password: _, ...userWithoutPassword } = newUser
    return NextResponse.json(userWithoutPassword, { status: 201 })
  } catch (error) {
    console.error('Error creando usuario:', error)
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 })
  }
}
