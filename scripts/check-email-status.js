const { Resend } = require('resend');

const resend = new Resend('re_Esu3ntGe_LYKJqSC8LNkKUe8Tu8WsbyyS');

async function checkEmailStatus() {
  try {
    // Check the most recent email
    const emailId = '4bcce89e-2c4f-4fbd-a689-79ab8be49348';
    
    console.log(`Checking status of email: ${emailId}\n`);
    
    const email = await resend.emails.get(emailId);
    
    console.log('Email Details:');
    console.log(JSON.stringify(email, null, 2));
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkEmailStatus();
