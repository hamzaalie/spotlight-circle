/**
 * Script to create a new admin user with credentials
 * 
 * Usage:
 * Run this script with: npx tsx scripts/create-admin-user.ts
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createAdminUser() {
  try {
    console.log('\n🔐 Creating Admin User\n')

    const email = 'admin@spotlightcircle.com'
    const password = '@@Admin1122'

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      console.log(`❌ User with email ${email} already exists`)
      console.log('   Use the make-admin.ts script to change their role instead.')
      process.exit(1)
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'ADMIN',
        emailVerified: new Date(),
        profile: {
          create: {
            firstName: 'Admin',
            lastName: 'User',
            profession: 'Administrator',
            biography: 'Platform Administrator',
            city: 'System',
            zipCode: '00000',
            referralSlug: 'admin',
          }
        }
      },
      include: {
        profile: true
      }
    })

    console.log('✅ Admin user created successfully!')
    console.log('\nLogin Credentials:')
    console.log(`   Email: ${email}`)
    console.log(`   Password: ${password}`)
    console.log('\n⚠️  Important: Change this password after first login!\n')

  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

createAdminUser()
