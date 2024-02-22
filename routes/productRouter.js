const express = require('express')
const productRouter = express.Router()

/**
 * @swagger
 * /product/{productId}:
 *   get:
 *     summary: Get Detailed Product Details
 *     description: Fetches the detailed information of a specific product by its ID.
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         description: ID of the product to retrieve
 *         schema:
 *           type: integer
 *           format: int64
 *     responses:
 *       200:
 *         description: Product details retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                 category_id:
 *                   type: number
 *                 title:
 *                   type: string
 *                 price:
 *                   type: number
 *                 description:
 *                   type: string
 *                 availability:
 *                   type: boolean
 *                 created_at:
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
//Product Details
productRouter.get('/:productId', async (req, res) => {
  const productId = req.params.productId
  try {
    const product = await client.query('SELECT * FROM products WHERE id = $1', [productId])
    res.json(product.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
});


module.exports = productRouter