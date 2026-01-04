const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const categories = [
  { name: "Real Estate", order: 1 },
  { name: "Insurance", order: 2 },
  { name: "Financial Planning", order: 3 },
  { name: "Mortgage Lending", order: 4 },
  { name: "Legal Services", order: 5 },
  { name: "Accounting & Tax", order: 6 },
  { name: "Marketing & Advertising", order: 7 },
  { name: "Web Design & Development", order: 8 },
  { name: "Photography & Videography", order: 9 },
  { name: "Event Planning", order: 10 },
  { name: "Catering & Food Services", order: 11 },
  { name: "Interior Design", order: 12 },
  { name: "Home Renovation & Construction", order: 13 },
  { name: "Landscaping & Lawn Care", order: 14 },
  { name: "Plumbing", order: 15 },
  { name: "Electrical Services", order: 16 },
  { name: "HVAC", order: 17 },
  { name: "Roofing", order: 18 },
  { name: "Pest Control", order: 19 },
  { name: "Cleaning Services", order: 20 },
  { name: "Moving & Storage", order: 21 },
  { name: "Auto Services", order: 22 },
  { name: "Health & Wellness", order: 23 },
  { name: "Fitness & Personal Training", order: 24 },
  { name: "Beauty & Salon Services", order: 25 },
  { name: "Pet Services", order: 26 },
  { name: "Education & Tutoring", order: 27 },
  { name: "Childcare & Daycare", order: 28 },
  { name: "IT & Tech Support", order: 29 },
  { name: "Consulting & Coaching", order: 30 },
  { name: "Travel & Tourism", order: 31 },
  { name: "Security Services", order: 32 },
  { name: "Other Professional Services", order: 99 },
]

async function seedCategories() {
  console.log('Seeding categories...')

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: { order: category.order },
      create: {
        name: category.name,
        order: category.order,
        isActive: true,
      },
    })
  }

  console.log(`✅ Seeded ${categories.length} categories`)
}

async function main() {
  try {
    await seedCategories()
    console.log('✅ Database seeding completed successfully')
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
