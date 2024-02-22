import express from "express"
import client from "../db";
const cartRouter = express.Router()

//Add a product to the cart
cartRouter.post('/', authMiddleware, async (req, res) => {
  const { productId, quantity } = req.body
  const userId = req.userId

  try {
    // Checking if the product exists
    const product = await client.query('SELECT * FROM products WHERE id = $1', [productId]);
    if (product.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Checking if the user already has the product in the cart
    const existingCartItem = await client.query('SELECT * FROM cart WHERE user_id = $1 AND product_id = $2', [userId, productId]);
    if (existingCartItem.rows.length > 0) {
      await pool.query('UPDATE cart SET quantity = quantity + $1 WHERE user_id = $2 AND product_id = $3', [quantity, userId, productId]);
    } else {
      await pool.query('INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3)', [userId, productId, quantity]);
    }

    res.status(200).json({ message: 'Product added to cart successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


//Get the Cart
cartRouter.get('/cart', authMiddleware, async (req, res) => {
  const userId = req.userId
  try {
    const cartItems = await pool.query('SELECT * FROM cart WHERE user_id = $1', [userId]);
    res.json(cartItems.rows);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


//Update the quantity of a product in the Cart
cartRouter.put('/', authMiddleware, async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.userId

  try {
    // Checking if the product exists in the cart
    const existingCartItem = await client.query('SELECT * FROM cart WHERE user_id = $1 AND product_id = $2', [userId, productId]);
    if (existingCartItem.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found in the cart' });
    }
    // Updating the quantity of the product
    await client.query('UPDATE cart SET quantity = $1 WHERE user_id = $2 AND product_id = $3', [quantity, userId, productId]);

    res.status(200).json({ message: 'Cart updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//Remove a product from the cart
cartRouter.delete('/', authMiddleware, async (req, res) => {
  const { productId } = req.body;
  const userId = req.userId

  try {
    //Checking if the product exists in the cart
    const existingCartItem = await client.query('SELECT * FROM cart WHERE user_id = $1 AND product_id = $2', [userId, productId]);
    if (existingCartItem.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found in the cart' });
    }
    //Removing the product from the cart
    await client.query('DELETE FROM cart WHERE user_id = $1 AND product_id = $2', [userId, productId]);

    res.status(200).json({ message: 'Product removed from cart successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

export default cartRouter