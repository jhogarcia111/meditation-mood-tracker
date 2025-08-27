import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { logActivity } from '@/lib/activity-logger'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { userId, email, password, country, language } = await request.json()

    // Validar campos requeridos
    if (!userId || !email || !password || !country || !language) {
      return NextResponse.json(
        { message: 'Todos los campos son requeridos' },
        { status: 400 }
      )
    }

    // Verificar si el userId ya existe
    const existingUser = await prisma.user.findUnique({
      where: { userId },
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'El ID de usuario ya está en uso' },
        { status: 400 }
      )
    }

    // Verificar si el email ya existe
    const existingEmail = await prisma.user.findUnique({
      where: { email },
    })

    if (existingEmail) {
      return NextResponse.json(
        { message: 'El email ya está registrado' },
        { status: 400 }
      )
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 12)

    // Crear el nuevo usuario
    const newUser = await prisma.user.create({
      data: {
        userId,
        email,
        password: hashedPassword,
        role: 'USER',
        country,
        language,
      },
    })

    // Generar token JWT
    const token = jwt.sign(
      { 
        userId: newUser.userId, 
        email: newUser.email, 
        role: newUser.role,
        id: newUser.id 
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    )

    // Registrar la actividad de registro
    await logActivity(newUser.id, 'REGISTER', 'Nuevo usuario registrado')

    // Retornar respuesta exitosa
    return NextResponse.json({
      message: 'Usuario registrado exitosamente',
      token,
      user: {
        id: newUser.id,
        userId: newUser.userId,
        email: newUser.email,
        role: newUser.role,
        country: newUser.country,
        language: newUser.language,
      },
    })
  } catch (error) {
    console.error('Error en registro:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
