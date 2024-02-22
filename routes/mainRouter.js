const express = require('express')
const cartRouter = require('./cartRouter')
const productRouter = require('./productRouter')
const categoryRouter = require('./categoryRouter')
const orderRouter = require('./orderRouter')
const userRouter = require('./userRouter')
const mainRouter = express.Router()

mainRouter.use("/user", userRouter)
mainRouter.use("/category", categoryRouter)
mainRouter.use("/product", productRouter)
mainRouter.use("/cart", cartRouter)
mainRouter.use("/order", orderRouter)

module.exports = mainRouter