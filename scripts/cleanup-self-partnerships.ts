import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 Searching for self-partnerships...\n')

  // Find partnerships where initiator and receiver are the same person
  const selfPartnerships = await prisma.partnership.findMany({
    where: {
      receiverId: { not: null },
    },
    include: {
      initiator: {
        include: {
          profile: true,
        },
      },
      receiver: {
        include: {
          profile: true,
        },
      },
    },
  })

  // Filter for actual self-partnerships
  const actualSelfPartnerships = selfPartnerships.filter(
    (p) => p.initiatorId === p.receiverId
  )

  if (actualSelfPartnerships.length === 0) {
    console.log('✅ No self-partnerships found. Database is clean!')
    return
  }

  console.log(`⚠️  Found ${actualSelfPartnerships.length} self-partnership(s):\n`)

  actualSelfPartnerships.forEach((p, index) => {
    const user = p.initiator
    const name = user.profile
      ? `${user.profile.firstName} ${user.profile.lastName}`
      : user.email
    console.log(`${index + 1}. ${name} (${user.email})`)
    console.log(`   - Partnership ID: ${p.id}`)
    console.log(`   - Status: ${p.status}`)
    console.log(`   - Created: ${p.createdAt.toLocaleDateString()}`)
    console.log()
  })

  console.log('🗑️  Deleting self-partnerships...\n')

  // Delete self-partnerships
  const result = await prisma.partnership.deleteMany({
    where: {
      id: {
        in: actualSelfPartnerships.map((p) => p.id),
      },
    },
  })

  console.log(`✅ Deleted ${result.count} self-partnership(s)`)
  console.log('\n✨ Cleanup complete!')
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
