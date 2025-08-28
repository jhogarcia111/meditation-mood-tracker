import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

// Forzar renderizado dinámico
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Token no proporcionado' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)

    // Verificar el token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any

    // Buscar el usuario en la base de datos
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    })

    if (!user) {
      return NextResponse.json(
        { message: 'Usuario no encontrado' },
        { status: 401 }
      )
    }

    // Retornar información del usuario
    return NextResponse.json({
      id: user.id,
      userId: user.userId,
      email: user.email,
      role: user.role,
      country: user.country,
      language: user.language,
    })
  } catch (error) {
    console.error('Error verificando token:', error)
    return NextResponse.json(
      { message: 'Token inválido' },
      { status: 401 }
    )
  }
}
