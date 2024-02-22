const express = require('express')
const client = require("../db")
const categoryRouter = express.Router()

/**
 * @swagger
 * /category:
 *   get:
 *     summary: Get list of all the Categories
 *     description: Retrieves a list of all the categories present
 *     responses:
 *       200:
 *         description: Categories retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                   name:
 *                     type: string
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
//Category Listing
categoryRouter.get('/', async (req, res) => {
  try {
    const categories = await client.query('SELECT * FROM categories')
    res.json(categories.rows)
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
});


/**
 * @swagger
 * /category/{categoryId}:
 *   get:
 *     summary: Get list of all the Products of a specific category
 *     description: Retrieves a list of products with essential details such as title, price, description, and availability, based on categoryId
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         description: ID of the category to retrieve products for
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Products retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                   category_id:
 *                     type: number
 *                   title:
 *                     type: string
 *                   price:
 *                     type: number
 *                   description:
 *                     type: string
 *                   availability:
 *                     type: boolean
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
//Product Listing based on Category ID
categoryRouter.get('/:categoryId', async (req, res) => {
  const categoryId = req.params.categoryId
  try {
    const products = await client.query('SELECT * FROM products WHERE category_id = $1', [categoryId])
    res.json(products.rows)
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
});
module.exports = categoryRouter