/**
 * Script to make a user an admin
 * 
 * Usage:
 * Run this script with: npx tsx scripts/make-admin.ts
 * 
 * You'll be prompted to enter an email address
 */

import { PrismaClient } from '@prisma/client'
import * as readline from 'readline'

const prisma = new PrismaClient()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(query: string): Promise<string> {
  return new Promise(resolve => {
    rl.question(query, resolve)
  })
}

async function makeAdmin() {
  try {
    console.log('\n🔐 Make User Admin\n')
    console.log('This script will change a user\'s role to ADMIN.\n')

    const email = await question('Enter the email address: ')

    if (!email || !email.includes('@')) {
      console.log('❌ Invalid email address')
      process.exit(1)
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.trim() },
      include: {
        profile: {
          select: {
            firstName: true,
            lastName: true,
          }
        }
      }
    })

    if (!user) {
      console.log(`❌ User not found with email: ${email}`)
      process.exit(1)
    }

    // Check if already admin
    if (user.role === 'ADMIN') {
      console.log(`ℹ️  User ${email} is already an admin`)
      process.exit(0)
    }

    // Show user details
    console.log('\nUser found:')
    console.log(`  Email: ${user.email}`)
    console.log(`  Name: ${user.profile ? `${user.profile.firstName} ${user.profile.lastName}` : 'No profile'}`)
    console.log(`  Current Role: ${user.role}`)

    const confirm = await question('\nMake this user an admin? (yes/no): ')

    if (confirm.toLowerCase() !== 'yes') {
      console.log('❌ Operation cancelled')
      process.exit(0)
    }

    // Update user role
    await prisma.user.update({
      where: { email: email.trim() },
      data: { role: 'ADMIN' }
    })

    console.log('\n✅ Success!')
    console.log(`   ${email} is now an ADMIN`)
    console.log('\n⚠️  Important: User must sign out and sign back in for changes to take effect.\n')

  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  } finally {
    rl.close()
    await prisma.$disconnect()
  }
}

makeAdmin()
