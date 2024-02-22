import express from "express"
import mainRouter from "./routes/mainRouter"
const app = express()

app.use(express.json())
app.use("/api/vi", mainRouter)
app.use((err,req,res,next)=>{
  res.status(500).json({ error: 'Internal Server Error' })
})

app.listen(3000)
