import * as dotenv from 'dotenv'
import app from "./app.js"
import fs from "node:fs"
import https from "node:https"

dotenv.config()
const PORT = process.env.PORT || 3000
 
const options = {
  key: fs.readFileSync("./certificado.key"),
  cert: fs.readFileSync("./certificado.cert")
};

https.createServer(options, app).listen(PORT, () => {
  console.log(`\n App listening at https://localhost:${PORT}`)
});
