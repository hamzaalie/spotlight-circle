const { Resend } = require('resend');

const resend = new Resend('re_Esu3ntGe_LYKJqSC8LNkKUe8Tu8WsbyyS');

async function testEmail() {
  try {
    console.log('Testing noreply@spotlightcircles.com...\n');
    
    const result = await resend.emails.send({
      from: 'Spotlight Circles <noreply@spotlightcircles.com>',
      to: 'paladinmarketers@gmail.com',
      subject: 'Test Partnership Invitation',
      html: '<h1>Test Email</h1><p>If you receive this, partnership invitations will work!</p>',
    });

    console.log('✅ SUCCESS! Email sent');
    console.log('Result:', JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('❌ FAILED to send email');
    console.error('Error:', JSON.stringify(error, null, 2));
  }
}

testEmail();
