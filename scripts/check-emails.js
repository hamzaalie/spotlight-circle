const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkEmails() {
  try {
    const logs = await prisma.emailLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10
    });
    
    console.log('\n=== Recent Email Logs ===\n');
    
    if (logs.length === 0) {
      console.log('No email logs found in database.');
    } else {
      logs.forEach((log, i) => {
        console.log(`${i + 1}. To: ${log.to}`);
        console.log(`   Subject: ${log.subject}`);
        console.log(`   Status: ${log.status}`);
        console.log(`   Error: ${log.error || 'None'}`);
        console.log(`   Resend ID: ${log.resendId || 'N/A'}`);
        console.log(`   Created: ${log.createdAt}`);
        console.log('---');
      });
    }
    
    // Also check partnerships to see invitations
    const partnerships = await prisma.partnership.findMany({
      where: { status: 'PENDING' },
      orderBy: { createdAt: 'desc' },
      take: 5
    });
    
    console.log('\n=== Recent Pending Partnerships ===\n');
    partnerships.forEach((p, i) => {
      console.log(`${i + 1}. Email: ${p.invitedEmail || 'N/A'}`);
      console.log(`   ID: ${p.id}`);
      console.log(`   Created: ${p.createdAt}`);
      console.log('---');
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkEmails();
