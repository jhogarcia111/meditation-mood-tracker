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
    const { nameEs, nameEn, category, isActive } = body

    const updateData: any = {}
    if (nameEs !== undefined) updateData.nameEs = nameEs
    if (nameEn !== undefined) updateData.nameEn = nameEn
    if (category !== undefined) updateData.category = category
    if (isActive !== undefined) updateData.isActive = isActive

    // Verificar si el nombre ya existe en otro sentimiento
    if (nameEs || nameEn) {
      const existingFeeling = await prisma.feeling.findFirst({
        where: {
          id: { not: params.id },
          OR: [
            ...(nameEs ? [{ nameEs }] : []),
            ...(nameEn ? [{ nameEn }] : [])
          ]
        }
      })

      if (existingFeeling) {
        return NextResponse.json({ message: 'El nombre del sentimiento ya existe' }, { status: 400 })
      }
    }

    const updatedFeeling = await prisma.feeling.update({
      where: { id: params.id },
      data: updateData,
    })

    await logActivity(decoded.id, 'UPDATE_FEELING', `Sentimiento actualizado: ${updatedFeeling.nameEs}`)

    return NextResponse.json(updatedFeeling)
  } catch (error) {
    console.error('Error actualizando sentimiento:', error)
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

    // Verificar si el sentimiento está siendo usado
    const feelingUsage = await prisma.feelingRating.findFirst({
      where: { feelingId: params.id }
    })

    if (feelingUsage) {
      return NextResponse.json({ 
        message: 'No se puede eliminar el sentimiento porque está siendo usado en registros' 
      }, { status: 400 })
    }

    const deletedFeeling = await prisma.feeling.delete({
      where: { id: params.id },
    })

    await logActivity(decoded.id, 'DELETE_FEELING', `Sentimiento eliminado: ${deletedFeeling.nameEs}`)

    return NextResponse.json({ message: 'Sentimiento eliminado exitosamente' })
  } catch (error) {
    console.error('Error eliminando sentimiento:', error)
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 })
  }
}
