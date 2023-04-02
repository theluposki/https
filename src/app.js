import express from "express"
import cors from "cors"

import appRouter from "./routes/app-router.js"

const app = express();

/* Middlewares */
app.use(cors())
app.use(express.json())
app.use("/", express.static("src/public"))

/* Routes */
app.use("/info", appRouter)

/* Export App */
export default app
