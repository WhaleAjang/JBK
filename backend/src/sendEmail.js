const nodemailer = require("nodemailer");

const sendEmail = async () => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        //secure: true, // use TLS
        auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASSWORD },
    });

    const mailOptions = {
        to: process.env.RECEIVE_USER,
        subject: process.env.EMAIL_SUBJECT, // 제목
        text : "git push 알림입니다.",
        html: `<h1>GIT NOTOFICATION</h1><p>${process.env.EMAIL_BODY}</p>`,
        // attachments: [
        //
        // ],
    };
    console.log("subject: ",process.env.EMAIL_SUBJECT);
    await transporter.sendMail(mailOptions);
};

sendEmail();
