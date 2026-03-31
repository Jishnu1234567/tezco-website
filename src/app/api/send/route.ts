import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { user_name, user_email, message } = await req.json();

    await resend.emails.send({
      from: 'TEZCO Website <onboarding@resend.dev>',
      to: 'tezcoservices@gmail.com',
      subject: `New Inquiry: ${user_name}`,
      html: `<p><strong>Name:</strong> ${user_name}</p>
             <p><strong>Email:</strong> ${user_email}</p>
             <p><strong>Message:</strong> ${message}</p>`,
    });

    await resend.emails.send({
      from: 'TEZCO Support <onboarding@resend.dev>',
      to: user_email,
      subject: 'Inquiry Received – TEZCO',
      html: `
        <div style="font-family: sans-serif; text-align: center;">
          <h1 style="color: #000;">TEZCO</h1>
          <p style="text-transform: uppercase; letter-spacing: 2px; font-size: 10px;">Technical Experts</p>
          <h2>Hello ${user_name},</h2>
          <p>We have received your message. Our experts will reach out to you shortly.</p>
        </div>`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 });
  }
}