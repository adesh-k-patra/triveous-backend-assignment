const express = require('express')
const mainRouter = require('./routes/mainRouter')
const { rateLimit } = require('express-rate-limit')
const swaggerUi = require('swagger-ui-express');
const specs = require('./swagger.config');
const app = express()

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: 'Too many requests from this IP, please try again later',
});

app.use(limiter)
app.use(express.json())
app.use("/api/v1", mainRouter)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))

app.listen(3000)
