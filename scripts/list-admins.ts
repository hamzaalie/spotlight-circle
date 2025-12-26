/**
 * Script to list all admin users
 * 
 * Usage:
 * Run this script with: npx tsx scripts/list-admins.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function listAdmins() {
  try {
    console.log('\n👑 Admin Users\n')

    const admins = await prisma.user.findMany({
      where: { role: 'ADMIN' },
      include: {
        profile: {
          select: {
            firstName: true,
            lastName: true,
            profession: true,
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    if (admins.length === 0) {
      console.log('No admin users found.')
      console.log('\nTo create an admin user, run:')
      console.log('  npx tsx scripts/make-admin.ts\n')
      return
    }

    console.log(`Found ${admins.length} admin user(s):\n`)

    admins.forEach((admin, index) => {
      console.log(`${index + 1}. ${admin.email}`)
      if (admin.profile) {
        console.log(`   Name: ${admin.profile.firstName} ${admin.profile.lastName}`)
        console.log(`   Profession: ${admin.profile.profession}`)
      }
      console.log(`   Created: ${admin.createdAt.toLocaleDateString()}`)
      console.log()
    })

  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

listAdmins()
