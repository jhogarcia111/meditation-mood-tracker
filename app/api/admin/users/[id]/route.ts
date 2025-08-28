import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyToken } from '@/lib/auth'
import { logActivity } from '@/lib/activity-logger'

const prisma = new PrismaClient()

// Forzar renderizado dinámico
export const dynamic = 'force-dynamic'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const { userId, email, role, country, language } = body

    const updateData: any = {}
    if (userId !== undefined) updateData.userId = userId
    if (email !== undefined) updateData.email = email
    if (role !== undefined) updateData.role = role
    if (country !== undefined) updateData.country = country
    if (language !== undefined) updateData.language = language

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
    })

    await logActivity(decoded.id, 'UPDATE_USER', `Usuario actualizado: ${updatedUser.userId}`)

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error actualizando usuario:', error)
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Verificar que no se elimine a sí mismo
    if (decoded.id === params.id) {
      return NextResponse.json({ message: 'No puedes eliminar tu propia cuenta' }, { status: 400 })
    }

    const deletedUser = await prisma.user.delete({
      where: { id: params.id },
    })

    await logActivity(decoded.id, 'DELETE_USER', `Usuario eliminado: ${deletedUser.userId}`)

    return NextResponse.json({ message: 'Usuario eliminado exitosamente' })
  } catch (error) {
    console.error('Error eliminando usuario:', error)
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 })
  }
}
