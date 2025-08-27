import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../lib/auth'

const prisma = new PrismaClient()

async function main() {
  console.log('🔐 Actualizando contraseña del administrador...')

  try {
    // Buscar el usuario admin
    const adminUser = await prisma.user.findFirst({
      where: {
        role: 'ADMIN'
      }
    })

    if (!adminUser) {
      console.log('❌ No se encontró ningún usuario administrador')
      return
    }

    console.log(`👤 Usuario admin encontrado: ${adminUser.userId} (${adminUser.email})`)

    // Hashear la nueva contraseña
    const newPassword = 'wcdmocol2025'
    const hashedPassword = await hashPassword(newPassword)

    // Actualizar la contraseña
    await prisma.user.update({
      where: {
        id: adminUser.id
      },
      data: {
        password: hashedPassword
      }
    })

    console.log('✅ Contraseña del administrador actualizada exitosamente!')
    console.log(`🔑 Nueva contraseña: ${newPassword}`)
    console.log(`👤 Usuario: ${adminUser.userId}`)
    console.log(`📧 Email: ${adminUser.email}`)

  } catch (error) {
    console.error('❌ Error actualizando la contraseña:', error)
  }
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
