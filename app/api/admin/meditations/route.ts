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

    const meditations = await prisma.meditation.findMany({
      include: {
        tags: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(meditations)
  } catch (error) {
    console.error('Error obteniendo meditaciones:', error)
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
    const { title, description, youtubeUrl, duration, tagIds } = body

    if (!title || !description || !youtubeUrl || !duration) {
      return NextResponse.json({ message: 'Todos los campos son requeridos' }, { status: 400 })
    }

    const meditation = await prisma.meditation.create({
      data: {
        title,
        description,
        youtubeUrl,
        duration: parseInt(duration),
        tags: {
          connect: tagIds?.map((id: string) => ({ id })) || [],
        },
      },
      include: {
        tags: true,
      },
    })

    await logActivity(decoded.id, 'CREATE_MEDITATION', `Meditación creada: ${title}`)

    return NextResponse.json(meditation, { status: 201 })
  } catch (error) {
    console.error('Error creando meditación:', error)
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 })
  }
}
