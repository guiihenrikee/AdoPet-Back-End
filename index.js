import * as dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import jsonwebtoken from "jsonwebtoken";
import cors from "cors";
import usersRoutes from "./src/routes/usersRoutes";
import postsRoutes from "./src/routes/postsRoutes";
import connection from "./db";

dotenv.config();
const app = express();
const PORT = 4000;

// cors setup to allow the connection by the front-end
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

//mongoose connection coming from db.js
connection();

// body-parser setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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

// Allowing static files.
app.use(express.static("Images"));

app.get("/", async (req, res) => {
  res.send(`Node and express server running on port ${PORT}`);
});

app.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`);
});
