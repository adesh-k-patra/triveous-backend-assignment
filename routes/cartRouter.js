const express = require('express')
const client = require("../db")
const authMiddleware = require("../authMiddleware")
const cartRouter = express.Router()

/**
 * @swagger
 * /cart:
 *   post:
 *     summary: Add a product to the cart
 *     description: Add a product to the cart
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: number
 *               quantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Product added to cart successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Product not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
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
//Add a product to the cart
cartRouter.post('/', authMiddleware, async (req, res) => {
  const { productId, quantity } = req.body
  const userId = req.userId

  try {
    // Checking if the product exists
    const product = await client.query('SELECT * FROM products WHERE id = $1', [productId])
    if (product.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' })
    }

    // Checking if the user already has the product in the cart
    const existingCartItem = await client.query('SELECT * FROM carts WHERE user_id = $1 AND product_id = $2', [userId, productId])
    if (existingCartItem.rows.length > 0) {
      await client.query('UPDATE carts SET quantity = quantity + $1 WHERE user_id = $2 AND product_id = $3', [quantity, userId, productId])
    } else {
      await client.query('INSERT INTO carts (user_id, product_id, quantity) VALUES ($1, $2, $3)', [userId, productId, quantity])
    }

    res.status(200).json({ message: 'Product added to cart successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
});

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get all the products present in the cart
 *     description: Get all the products present in the cart
 *     responses:
 *       200:
 *         description: Product added to cart successfully.
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
//Get the Cart
cartRouter.get('/', authMiddleware, async (req, res) => {
  const userId = req.userId
  try {
    const cartItems = await client.query('SELECT * FROM carts WHERE user_id = $1', [userId])
    res.json(cartItems.rows)
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
});

/**
 * @swagger
 * /cart:
 *   put:
 *     summary: Update the quantity of a product to the cart
 *     description: Update the quantity of a product to the cart
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: number
 *               quantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Cart updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Product not found in the cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
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
//Update the quantity of a product in the Cart
cartRouter.put('/', authMiddleware, async (req, res) => {
  const { productId, quantity } = req.body
  const userId = req.userId

  try {
    // Checking if the product exists in the cart
    const existingCartItem = await client.query('SELECT * FROM carts WHERE user_id = $1 AND product_id = $2', [userId, productId])
    if (existingCartItem.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found in the cart' })
    }
    // Updating the quantity of the product
    await client.query('UPDATE carts SET quantity = $1 WHERE user_id = $2 AND product_id = $3', [quantity, userId, productId])

    res.status(200).json({ message: 'Cart updated successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
});

/**
 * @swagger
 * /cart:
 *   delete:
 *     summary: Remove a product from the cart
 *     description: Remove a product from the cart
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: number
 *               quantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Product removed from cart successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Product not found in the cart.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
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
//Remove a product from the cart
cartRouter.delete('/', authMiddleware, async (req, res) => {
  const { productId } = req.body;
  const userId = req.userId

  try {
    //Checking if the product exists in the cart
    const existingCartItem = await client.query('SELECT * FROM carts WHERE user_id = $1 AND product_id = $2', [userId, productId])
    if (existingCartItem.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found in the cart' })
    }
    //Removing the product from the cart
    await client.query('DELETE FROM carts WHERE user_id = $1 AND product_id = $2', [userId, productId])

    res.status(200).json({ message: 'Product removed from cart successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

module.exports = cartRouter