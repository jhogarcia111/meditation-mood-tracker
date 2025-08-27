import { PrismaClient } from '@prisma/client'
import { FEELINGS_DATA } from '../utils/constants'

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Inicializando datos de la aplicación...')

  // Crear sentimientos buenos
  console.log('📝 Creando sentimientos buenos...')
  for (const feeling of FEELINGS_DATA.good) {
    await prisma.feeling.create({
      data: {
        nameEs: feeling.nameEs,
        nameEn: feeling.nameEn,
        category: 'GOOD',
        isActive: true,
      },
    })
    console.log(`✅ Sentimiento creado: ${feeling.nameEs}`)
  }

  // Crear sentimientos malos
  console.log('📝 Creando sentimientos malos...')
  for (const feeling of FEELINGS_DATA.bad) {
    await prisma.feeling.create({
      data: {
        nameEs: feeling.nameEs,
        nameEn: feeling.nameEn,
        category: 'BAD',
        isActive: true,
      },
    })
    console.log(`✅ Sentimiento creado: ${feeling.nameEs}`)
  }

  // Crear usuario administrador
  console.log('👤 Creando usuario administrador...')
  await prisma.user.create({
    data: {
      userId: 'admin',
      email: 'admin@meditation-tracker.com',
      password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK8O', // password: admin123
      role: 'ADMIN',
      language: 'ES',
      country: 'Colombia',
    },
  })
  console.log('✅ Usuario administrador creado')

  console.log('\n🎉 ¡Datos inicializados correctamente!')
  console.log('\n📋 Credenciales de acceso:')
  console.log('   Usuario: admin')
  console.log('   Contraseña: admin123')
  console.log('   Email: admin@meditation-tracker.com')
  console.log('\n🔗 Accede a: http://localhost:3000')
}

main()
  .catch((e) => {
    console.error('❌ Error durante la inicialización:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
