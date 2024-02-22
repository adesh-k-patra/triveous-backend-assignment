const express = require('express')
const authMiddleware = require('../authMiddleware')
const client = require('../db')

const orderRouter = express.Router()
orderRouter.use(authMiddleware)

/**
 * @swagger
 * /order/place:
 *   get:
 *     summary: Place an order with all the products from their cart.
 *     description: Place an order with all the products from their cart.
 *     responses:
 *       200:
 *         description: Order Placed Successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
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
    res.status(500).json({ error : 'Internal Server Error'})
  }
})

/**
 * @swagger
 * /order:
 *   get:
 *     summary: Get record of all the past orders.
 *     description: Get record of all the past orders.
 *     responses:
 *       200:
 *         description: Record retrived successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                   user_id:
 *                     type: number
 *                   product_id:
 *                     type: number
 *                   quantity:
 *                     type: number
 *                   created_at:
 *                     type: string
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
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

/**
 * @swagger
 * /order/{orderId}:
 *   get:
 *     summary: Get detailed information of a specific order
 *     description: Retrieves the detailed information of a specific order by its ID.
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         description: ID of the order to retrieve for
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Order retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                   user_id:
 *                     type: number
 *                   product_id:
 *                     type: number
 *                   quantity:
 *                     type: number
 *                   created_at:
 *                     type: string
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
//Order Details
orderRouter.get('/:orderId', async(req,res) => {
  const orderId = req.params.orderId

  try {
    const order = await client.query('SELECT * FROM orders WHERE id = $1', [orderId])
    res.status(200).json(order.rows[0])
  } catch (error) {
    res.status(500).json({ error : 'Internal Server Error'})
  }
})
module.exports = orderRouter