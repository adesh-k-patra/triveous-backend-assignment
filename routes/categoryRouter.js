import express from "express"
import client from "../db"
const categoryRouter = express.Router()

//Category Listing
categoryRouter.get('/', async (req, res) => {
  try {
    const categories = await client.query('SELECT * FROM categories')
    res.json(categories.rows)
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
});

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


export default categoryRouter