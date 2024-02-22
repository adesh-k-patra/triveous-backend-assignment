import express from "express"
import mainRouter from "./routes/mainRouter"
const app = express()

app.use(express.json())
app.use("/api/vi", mainRouter)

app.listen(3000)
