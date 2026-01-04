const { Resend } = require('resend');

const resend = new Resend('re_Esu3ntGe_LYKJqSC8LNkKUe8Tu8WsbyyS');

async function testReferralEmail() {
  try {
    console.log('Testing referral email with no-reply@spotlightcircles.com...\n');
    
    const result = await resend.emails.send({
      from: "Spotlight Circles <no-reply@spotlightcircles.com>",
      to: 'paladinmarketers@gmail.com',
      subject: 'Test Referral Email',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #7c3aed;">New Referral Received!</h1>
          <p>This is a test of the referral email system.</p>
        </div>
      `,
    });

    console.log('Result:', JSON.stringify(result, null, 2));
    
    if (result.error) {
      console.error('\n❌ Email failed with error:', result.error.message);
    } else {
      console.log('\n✅ Email sent successfully!');
    }
    
  } catch (error) {
    console.error('\n❌ Exception:', error);
  }
}

testReferralEmail();
