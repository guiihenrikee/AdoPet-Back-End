import * as dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import jsonwebtoken from "jsonwebtoken";
import cors from "cors";
import nodemailer from "nodemailer";
import usersRoutes from "./src/routes/usersRoutes";
import postsRoutes from "./src/routes/postsRoutes";
import connection from "./db";

dotenv.config();
const app = express();
const PORT = 4000;

app.use(express.static("Images"));

//mongoose connection coming from db.js
connection();

// body-parser setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// cors setup to allow the connection by the front-end
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

//JWT authorization setup
app.use((req, res, next) => {
  if (
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "JWT"
  ) {
    jsonwebtoken.verify(
      req.headers.authorization.split(" ")[1],
      process.env.SECRET,
      (err, decode) => {
        if (err) req.user = undefined;
        req.user = decode;
        next();
      }
    );
  } else {
    req.user = undefined;
    next();
  }
});

// Applying the express on the users and posts routes
usersRoutes(app);
postsRoutes(app);

//smtp nodemailer

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  service: "gmail",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PW,
  },
});

app.post("/smtp", async (req, res) => {
  console.log(req.body);
  const data = req.body;

  const mailOptions = {
    from: "Adopet <adopet.tcc.email@gmail.com>",
    to: data.userEmail,
    subject: "Adopet - Nova aplicação de adoção",
    html: `<p>Olá!</p><p>Existe alguem interessado no seu pet!</p><br/><a>O interessado realizou o preenchimento do formulário de adoção, verifique abaixo as respostas.</a><br/><br/>
    <a><strong>Nome:</strong> ${data.form.firstName} ${data.form.lastName}</a><br/>
    <a><strong>Telefone:</strong> ${data.form.phone}</a><br/>
    <a><strong>Cidade:</strong> ${data.form.city}</a><br/>
    <a><strong>Email:</strong> ${data.form.email}</a><br/>
    <a><strong>Razão pela qual quer o animal:</strong> ${data.form.reason}</a><br/>
    <a><strong>Em caso de urgência, tem como levar o animal imediatamente a um veterinário?</strong> ${data.form.firstCommitment}</a><br/>
    <a><strong>Para cuidar do animal apropriadamente, você terá gastos com alimentação, cuidados de higiene e veterinário. Está em condições financeiras para isso?</strong> ${data.form.secondCommitment}</a><br/>
    <a><strong>O tempo de vida de um animal é de até 15 anos ou mais. Você está pronto para este compromisso?</strong> ${data.form.forthCommitment}</a><br/>
    <a><strong>Todos em sua família estão de acordo com a adoção de um animal?</strong> ${data.form.fifthCommitment}</a><br/>
    <a><strong>Você já teve um animal de estimação?</strong> ${data.form.thirdCommitment}</a><br/>
    <a><strong>Se você já teve, o que aconteceu com ele?</strong> ${data.form.field1}</a><br/>
    <a><strong>O animal ficará solto ou preso? Onde e como?</strong> ${data.form.field2}</a><br/>
    <a><strong>O que você faria com o animal se tivesse de mudar de endereço?</strong> ${data.form.field3}</a><br/>
    <a><strong>Por que gostaria de adotar um animal?</strong> ${data.form.field4}</a><br/>
    <br/><a>Saudações,</a><br/><a><strong>Adopet</strong></a>`,
  };

  try {
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        res.json("Email sent: " + info.response);
        console.log("Email sent: " + info.response);
      }
    });
  } catch (error) {
    res.json(error);
  }
});

app.get("/", async (req, res) => {
  res.send(`Node and express server running on port ${PORT}`);
});

app.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`);
});
