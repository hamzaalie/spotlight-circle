const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkReferralEmail() {
  try {
    const log = await prisma.emailLog.findFirst({
      where: { 
        subject: { 
          contains: 'New Referral' 
        } 
      },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log('\n=== Working Referral Email Details ===\n');
    console.log('FROM:', log?.from || 'N/A');
    console.log('TO:', log?.to || 'N/A');
    console.log('Subject:', log?.subject || 'N/A');
    console.log('Status:', log?.status || 'N/A');
    console.log('Resend ID:', log?.resendId || 'N/A (not actually sent via Resend)');
    console.log('Error:', log?.error || 'None');
    console.log('Created:', log?.createdAt || 'N/A');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkReferralEmail();
