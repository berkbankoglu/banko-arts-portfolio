import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json();
        const { name, email, message } = body;

        // Form validasyonu
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        // Email validasyonu
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Invalid email address' },
                { status: 400 }
            );
        }

        // Resend API kullanarak email gönderimi
        const RESEND_API_KEY = process.env.RESEND_API_KEY;

        if (!RESEND_API_KEY) {
            console.error('RESEND_API_KEY is not configured');
            return NextResponse.json(
                { error: 'Email service not configured' },
                { status: 500 }
            );
        }

        const emailContent = {
            from: 'Contact Form <onboarding@resend.dev>', // Resend'in test email'i
            to: process.env.CONTACT_EMAIL || 'contact@bankoarts.com',
            subject: `New Contact Form Message from ${name}`,
            replyTo: email,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: #0a0a0a; color: white; padding: 20px; text-align: center; }
                        .content { background: #f5f5f5; padding: 30px; border-radius: 5px; margin: 20px 0; }
                        .field { margin-bottom: 20px; }
                        .label { font-weight: bold; color: #666; font-size: 12px; text-transform: uppercase; }
                        .value { margin-top: 5px; font-size: 16px; }
                        .message-box { background: white; padding: 20px; border-left: 4px solid #0a0a0a; margin-top: 10px; }
                        .footer { text-align: center; color: #999; font-size: 12px; margin-top: 20px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 2px;">BANKO ARTS</h1>
                            <p style="margin: 10px 0 0 0; opacity: 0.8;">New Contact Form Submission</p>
                        </div>

                        <div class="content">
                            <div class="field">
                                <div class="label">From</div>
                                <div class="value">${name}</div>
                            </div>

                            <div class="field">
                                <div class="label">Email</div>
                                <div class="value"><a href="mailto:${email}">${email}</a></div>
                            </div>

                            <div class="field">
                                <div class="label">Message</div>
                                <div class="message-box">${message.replace(/\n/g, '<br>')}</div>
                            </div>
                        </div>

                        <div class="footer">
                            <p>This message was sent from your portfolio contact form</p>
                            <p>bankoarts.com</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
            text: `
New Contact Form Message

From: ${name}
Email: ${email}

Message:
${message}

---
This message was sent from your portfolio contact form
            `
        };

        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RESEND_API_KEY}`
            },
            body: JSON.stringify(emailContent)
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Resend API error:', data);
            return NextResponse.json(
                { error: 'Failed to send email', details: data },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { success: true, message: 'Email sent successfully', id: data.id },
            { status: 200 }
        );

    } catch (error) {
        console.error('Contact form error:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}
