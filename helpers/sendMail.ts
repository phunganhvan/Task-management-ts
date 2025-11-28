import nodemailer from "nodemailer";

export const sendMail = async (
    emailUser: string,
    subject: string,
    html: string
): Promise<void> => {

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER as string,
            pass: process.env.EMAIL_PASSWORD as string,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: emailUser,
        subject,
        html,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.response);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};
