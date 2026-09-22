import * as nodemailer from 'nodemailer';

async function testEmail() {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'saisatwikadhupam@gmail.com',
      pass: 'awkkqpoopxbhnhwq',
    },
  });

  try {
    const info = await transporter.sendMail({
      from: 'saisatwikadhupam@gmail.com',
      to: 'saisatwikadhupam@gmail.com',
      subject: 'Test Email',
      text: 'This is a test email to verify SMTP credentials.',
    });
    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.error('Error occurred:', error);
  }
}

testEmail();
