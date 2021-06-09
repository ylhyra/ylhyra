const nodemailer = require("nodemailer");

export default async() => {

  return; 
  if(
    !process.env.EMAIL_PASSWORD ||
    !process.env.EMAIL_SMTP_HOST
  ) return console.warn('Missing details');

  let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SMTP_HOST,
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  let info = await transporter.sendMail({
    from: '"Ylhýra" <ylhyra@ylhyra.is>',
    to: "egillsigurdur@gmail.com",
    subject: "Hello ✔",
    text: "Hello world?",
    html: "<b>Hello world?</b>",
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
