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
        html: `<h1>GIT PUSH NOTOFICATION</h1><p>git push가 성공하였습니다!</p>`,
        // attachments: [
        //
        // ],
    };
    console.log("subject: ",process.env.EMAIL_SUBJECT);
    await transporter.sendMail(mailOptions);
};

sendEmail();
