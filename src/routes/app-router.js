import { Router } from "express"

const route = Router()

route.get("/", (req,res) => {
    res.send("Hello world using HTTPS!");
})

export default route
