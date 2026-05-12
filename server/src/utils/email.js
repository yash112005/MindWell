const { Resend } = require('resend');

const sendEmail = async ({ to, subject, html }) => {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn('⚠️ RESEND_API_KEY is missing. Email will not be sent.');
    console.log('\n========================================');
    console.log('📧 EMAIL CONTENT (Dev Mode)');
    console.log('========================================');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log('========================================\n');
    return { success: false, message: 'API key missing' };
  }

  const resend = new Resend(apiKey);

  console.log(`📨 Sending email to: ${to}`);
  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to,
      subject,
      html,
    });

    if (error) {
      console.error('❌ Resend Error:', error);
      return { success: false, error };
    }

    console.log('✅ Email sent successfully:', data.id);
    return { success: true, data };
  } catch (err) {
    console.error('❌ Unexpected Email Error:', err);
    return { success: false, error: err.message };
  }
};

module.exports = { sendEmail };
