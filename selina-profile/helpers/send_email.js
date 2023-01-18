const nodemailer = require("nodemailer")

const account = "system.selina@gmail.com"
const password = "odaadqhnjygtkuvy"

const email_service_config = {
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: account,
        pass: password,
    },
    tls: {
        rejectUnauthorized: false
    }
}

const transporter = nodemailer.createTransport(email_service_config)

const send_mail = async (to, subject, html) => {
    transporter.verify(function (error, success) {
        if (error) {
          console.log("---", error);
        } else {
          console.log("Server is ready to take our messages");
        }
    });

    const email_config = {
        from: account, 
        to: to,
        subject: subject, 
        html: html,
    }

    await transporter.sendMail(email_config)
}

module.exports = { send_mail }