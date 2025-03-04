const nodemailer = require("nodemailer");

const sendEmail = async (email, text) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, 
        auth: {
          user: "aronjose095@gmail.com",
          pass: "zahaylqccnfzsfcz",
        },
      });

      const info = await transporter.sendMail({
        from: '"Event Zone Connect" <aronjose095@gmail.com>', 
        to: email, 
        subject: "Event Zone Connect Verify Email", 
        html:  `<div><p>This is the verifying token. Please click the link to verify your email: <a href="http://localhost:3000/verify?token=${text}">Verify Email</a></p></div>`
        , 
      });
};
module.exports = sendEmail;