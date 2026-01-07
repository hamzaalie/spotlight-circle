const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function checkEmailLogs() {
  try {
    const logs = await prisma.emailLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        to: true,
        subject: true,
        status: true,
        error: true,
        createdAt: true,
        sentAt: true,
      }
    })
    
    console.log('Recent Email Logs:')
    console.log('==================')
    logs.forEach(log => {
      console.log(`\nID: ${log.id}`)
      console.log(`To: ${log.to}`)
      console.log(`Subject: ${log.subject}`)
      console.log(`Status: ${log.status}`)
      if (log.error) {
        console.log(`Error: ${log.error}`)
      }
      console.log(`Created: ${log.createdAt}`)
      if (log.sentAt) {
        console.log(`Sent: ${log.sentAt}`)
      }
      console.log('---')
    })
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkEmailLogs()
