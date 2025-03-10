import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true, // true for port 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  }
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // First verify the connection
    await new Promise((resolve, reject) => {
      transporter.verify(function (error, success) {
        if (error) {
          console.log('SMTP Verification Error:', error);
          reject(error);
        } else {
          console.log('SMTP Connection Successful');
          resolve(success);
        }
      });
    });

    // Send test email
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM_EMAIL,
      to: process.env.ADMIN_EMAIL,
      subject: 'Test Email - Strategic Sync',
      html: `
        <h2>Test Email</h2>
        <p>This is a test email to verify the SMTP configuration.</p>
        <p>Configuration details:</p>
        <ul>
          <li>SMTP Host: ${process.env.SMTP_HOST}</li>
          <li>SMTP Port: ${process.env.SMTP_PORT}</li>
          <li>From Email: ${process.env.SMTP_FROM_EMAIL}</li>
          <li>To Email: ${process.env.ADMIN_EMAIL}</li>
        </ul>
        <p>If you received this email, your SMTP configuration is working correctly!</p>
      `,
    });

    console.log('Test email sent:', info.messageId);
    res.status(200).json({ 
      message: 'Test email sent successfully',
      messageId: info.messageId
    });
  } catch (error) {
    console.error('Error sending test email:', error);
    res.status(500).json({ 
      message: 'Error sending test email',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 