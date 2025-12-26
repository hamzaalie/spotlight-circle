import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../src/lib/auth'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...\n')

  // Create default admin account
  const adminEmail = 'admin@spotlightcircles.com'
  const adminPassword = 'Admin123!'

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  })

  if (existingAdmin) {
    console.log('✅ Admin user already exists')
    console.log(`   Email: ${adminEmail}`)
    console.log(`   Password: ${adminPassword}`)
    return
  }

  // Hash the password
  const hashedPassword = await hashPassword(adminPassword)

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      password: hashedPassword,
      role: 'ADMIN',
      emailVerified: new Date(),
    }
  })

  console.log('✅ Admin user created successfully!\n')
  console.log('📧 Login Credentials:')
  console.log('   Email:    admin@spotlightcircles.com')
  console.log('   Password: Admin123!')
  console.log('\n🔗 Access admin panel at: http://localhost:3000/admin')
  console.log('\n⚠️  IMPORTANT: Change this password in production!\n')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
