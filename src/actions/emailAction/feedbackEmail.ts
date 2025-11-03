'use server';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);



export async function sendFeedbackEmail(formData: FormData) {
  try {
    const name=formData.get('name') as string;
    const email=formData.get('email') as string;
    const subject=formData.get('subject') as string;
    const message=formData.get('message') as string;
    const { data, error } = await resend.emails.send({
      from: `Feedback Form <${process.env.CONTACT_RECEIVER_EMAIL}>`, 
      to: ['priyanshu10503@gmail.com'], 
      subject: `New Feedback: ${subject}`,
      text: `
        Name: ${name}
        Email: ${email}
        Subject: ${subject}
        
        Message:
        ${message}
      `,
      html: `
        <div>
          <h2>New Feedback Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error: 'Failed to send email' };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}