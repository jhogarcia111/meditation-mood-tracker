import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { logActivity } from '@/lib/activity-logger'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { userId, password } = await request.json()

    // Validar que se proporcionen los campos requeridos
    if (!userId || !password) {
      return NextResponse.json(
        { message: 'Usuario y contraseña son requeridos' },
        { status: 400 }
      )
    }

    // Buscar el usuario por userId
    const user = await prisma.user.findUnique({
      where: { userId },
    })

    if (!user) {
      return NextResponse.json(
        { message: 'Usuario o contraseña incorrectos' },
        { status: 401 }
      )
    }

    // Verificar la contraseña
    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return NextResponse.json(
        { message: 'Usuario o contraseña incorrectos' },
        { status: 401 }
      )
    }

    // Generar token JWT
    const token = jwt.sign(
      { 
        userId: user.userId, 
        email: user.email, 
        role: user.role,
        id: user.id 
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    )

    // Registrar la actividad de login
    await logActivity(user.id, 'LOGIN', 'Usuario inició sesión exitosamente')

    // Retornar respuesta exitosa
    return NextResponse.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        userId: user.userId,
        email: user.email,
        role: user.role,
        country: user.country,
        language: user.language,
      },
    })
  } catch (error) {
    console.error('Error en login:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
