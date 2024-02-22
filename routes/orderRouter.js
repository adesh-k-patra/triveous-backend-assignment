const express = require('express')
const authMiddleware = require('../authMiddleware')
const client = require('../db')

const orderRouter = express.Router()
orderRouter.use(authMiddleware)

//Order Placement
orderRouter.get('/place', async (req,res) => {
  const userId = req.userId

  try {
    //Starting a transaction
    await client.query('BEGIN')

    const cartItems = await client.query('SELECT * FROM carts WHERE user_id = $1',[userId])
    cartItems.rows.map(async (i) => {
      await client.query('INSERT INTO orders (user_id, product_id, quantity) VALUES ($1, $2, $3)', [userId, i.product_id, i.quantity])
    })
    //Removing cart items after placing the order
    await client.query('DELETE FROM carts WHERE user_id = $1', [userId])

    await client.query('COMMIT')

    res.status(200).json({ message : 'Order Placed Successfully'})
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ message : 'Internal Server Error'})
  }
})

//Order History
orderRouter.get('/', async (req,res) => {
  const userId = req.userId
  try {
    const orderItems = await client.query('SELECT * FROM orders WHERE user_id = $1', [userId])
    res.status(200).json(orderItems.rows)
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

//Order Details
orderRouter.get('/:orderId', async(req,res) => {
  const orderId = req.params.orderId

  try {
    const order = await client.query('SELECT * FROM orders WHERE id = $1', [orderId])
    res.status(200).json(order.rows[0])
  } catch (error) {
    res.status(500).json({ message : 'Internal Server Error'})
  }
})
module.exports = orderRouter