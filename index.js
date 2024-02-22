const express = require('express')
const mainRouter = require('./routes/mainRouter')
const { rateLimit } = require('express-rate-limit')
const app = express()

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: 'Too many requests from this IP, please try again later',
});

app.use(limiter)
app.use(express.json())
app.use("/api/vi", mainRouter)

app.listen(3000)
