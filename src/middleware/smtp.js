import nodemailer from "nodemailer";

//nodemailer
export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  service: "gmail",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PW,
  },
});

export const mailOptions = {
  from: "Adopet <adopet.tcc.email@gmail.com>",
  to: "gui.ghrp@gmail.com",
  subject: "Adopet - Nova aplicação de adoção",
  html: "<p>Olá!</p><p>Existe alguem interessado no seu pet!</p><br/><a>O interessado realizou o preenchimento do forumulário de adoção, verifique abaixo as respostas.</a><br/><a>{{message}}</a><br/><a>Saudações,</a><br/><a>Adopet</a>",
};

transporter.sendMail(mailOptions, function (error, info) {
  if (error) {
    console.log(error);
  } else {
    console.log("Email sent: " + info.response);
  }
});
