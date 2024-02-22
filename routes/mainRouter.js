import express from 'express'
import cartRouter from './cartRouter'
import productRouter from './productRouter'
import categoryRouter from './categoryRouter'
const mainRouter = express.Router()

mainRouter.use("/category", categoryRouter)
mainRouter.use("/product", productRouter)
mainRouter.use("/cart", cartRouter)

export default mainRouter