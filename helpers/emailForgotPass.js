import nodemailer from 'nodemailer';

const emailForgotPass = async data => {
    const transport = nodemailer.createTransport({
        host: process.env.MAILTRAP_HOST,
        port: process.env.MAILTRAP_PORT,
        auth: {
          user: process.env.MAILTRAP_USER,
          pass: process.env.MAILTRAP_PASS
        }
    });
    const {email, name, token} = data;

    //* Sending the email
    const info = await transport.sendMail({
        from: 'APV',
        to: email,
        subject: 'Reset your password',
        text: 'Reset your password',
        html: `
            <p>Hi! <span style="font-weight: bold;">${name}</span>, you have requested to reset your password in APV</p>
            <p>Follow the next link to create your new password:
            <a href="${process.env.FRONTEND_URL}/forgot-password/${token}">Change Password</a></p>

            <br/>
            <h3>If you didn't request this account, please ignore this message.</h3>
        `
    });
    console.log('Message sent: %s', info.messageId);
}

export default emailForgotPass;