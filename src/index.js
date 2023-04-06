import * as dotenv from 'dotenv'
import app from "./app.js"
import fs from "node:fs"
import https from "node:https"
import { Socket } from './socket.js'

dotenv.config()
const PORT = process.env.PORT || 3000
 
const options = {
  key: fs.readFileSync("./certificado.key"),
  cert: fs.readFileSync("./certificado.cert")
};

const server = https.createServer(options, app)

Socket(server)

server.listen(PORT, () => {
  console.log(`\n App listening at https://localhost:${PORT}`)
});
