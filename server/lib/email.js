import { Resend } from 'resend';

const resend = () => new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (toEmail, token) => {
    const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

    try {
        const response = await resend().emails.send({
            from: "LinkWurk <noreply@linkwurk.online>",
            to: toEmail,
            subject: "Verify your LinkWurk email",
            html: `<a href="${verifyUrl}">Verify</a>`
        });

        console.log(response);
    } catch (err) {
        console.error(err);
    }
};

