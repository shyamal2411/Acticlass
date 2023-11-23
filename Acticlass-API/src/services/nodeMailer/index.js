const nodemailer = require('nodemailer');

async function sendMail(to, subject, text, cb) {
    try {
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            service: process.env.SMTP_HOST || 'gmail',
            port: process.env.SMTP_PORT || 465,
            secure: true,
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD,
            },
            pool: true
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"Acticlass" <acticlass@gmail.com>',
            to: to, // list of receivers
            subject: subject, // Subject line
            text: text, // plain text body            
        });

        console.log("[NodeMailer]", 'Message sent successfully.');
        if (cb) cb();
    } catch (error) {
        console.error("[NodeMailer]", error);
        if (cb) cb(error);
    }
}

module.exports = { sendMail };