const express = require('express')
const mainRouter = require("./routes/mainRouter")
const app = express()

app.use(express.json())
app.use("/api/vi", mainRouter)

app.listen(3000)
