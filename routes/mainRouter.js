import express from 'express'
import cartRouter from './cartRouter'
import productRouter from './productRouter'
import categoryRouter from './categoryRouter'
import orderRouter from './orderRouter'
const mainRouter = express.Router()

mainRouter.use("/category", categoryRouter)
mainRouter.use("/product", productRouter)
mainRouter.use("/cart", cartRouter)
mainRouter.use("/order", orderRouter)

export default mainRouter