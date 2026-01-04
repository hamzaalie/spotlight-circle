const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY || 're_Esu3ntGe_LYKJqSC8LNkKUe8Tu8WsbyyS');

async function sendTestEmail() {
  try {
    console.log('Sending test email...');
    console.log('API Key prefix:', process.env.RESEND_API_KEY?.substring(0, 15) || 're_Esu3ntGe_LYK...');
    
    const result = await resend.emails.send({
      from: 'Spotlight Circles <onboarding@resend.dev>',
      to: 'paladinmarketers@gmail.com',  // Change to your email
      subject: 'Direct Test Email from Spotlight Circles',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #0d9488;">Email Test Successful! 🎉</h2>
          <p>This is a direct test email sent at: ${new Date().toISOString()}</p>
          <p>If you received this, the email system is working correctly!</p>
        </div>
      `,
    });

    console.log('\n✅ Email sent successfully!');
    console.log('Result:', JSON.stringify(result, null, 2));
    
    if (result.error) {
      console.error('\n❌ Error:', result.error);
    }
    
  } catch (error) {
    console.error('\n❌ Failed to send email:');
    console.error(error);
  }
}

sendTestEmail();
