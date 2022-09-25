import * as dotenv from 'dotenv'
import express from "express"
import bodyParser from "body-parser"
import usersRoutes from "./src/routes/usersRoutes"
import postsRoutes from "./src/routes/postsRoutes"
import connection from "./db"

dotenv.config()
const app = express()
const PORT = 4000;

//mongoose connection coming from db.js
connection()

// body-parser setup
app.use(bodyParser.urlencoded({ extended: true}))
app.use(bodyParser.json())

usersRoutes(app)
postsRoutes(app)

// using static files
app.use(express.static('Images'))

app.get('/', (req, res) => {
  res.send(`Node and express server running on port ${PORT}`)
})

app.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`)
})