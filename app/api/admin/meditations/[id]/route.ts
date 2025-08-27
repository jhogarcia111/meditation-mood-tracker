import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyToken } from '@/lib/auth'
import { logActivity } from '@/lib/activity-logger'

const prisma = new PrismaClient()

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
    const { title, description, youtubeUrl, duration, isActive, tagIds } = body

    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (youtubeUrl !== undefined) updateData.youtubeUrl = youtubeUrl
    if (duration !== undefined) updateData.duration = parseInt(duration)
    if (isActive !== undefined) updateData.isActive = isActive

    const meditation = await prisma.meditation.update({
      where: { id: params.id },
      data: {
        ...updateData,
        tags: tagIds ? {
          set: tagIds.map((id: string) => ({ id })),
        } : undefined,
      },
      include: {
        tags: true,
      },
    })

    await logActivity(decoded.id, 'UPDATE_MEDITATION', `Meditación actualizada: ${meditation.title}`)

    return NextResponse.json(meditation)
  } catch (error) {
    console.error('Error actualizando meditación:', error)
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

    const meditation = await prisma.meditation.delete({
      where: { id: params.id },
    })

    await logActivity(decoded.id, 'DELETE_MEDITATION', `Meditación eliminada: ${meditation.title}`)

    return NextResponse.json({ message: 'Meditación eliminada exitosamente' })
  } catch (error) {
    console.error('Error eliminando meditación:', error)
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 })
  }
}
