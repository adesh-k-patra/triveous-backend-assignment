const express = require('express')
const productRouter = express.Router()

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