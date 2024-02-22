const express = require('express')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config') 
const client = require('../db')
const userRouter = express.Router()

/**
 * @swagger
 * /user/signup:
 *   post:
 *     summary: Create a new account
 *     description: Create a new user with the provided details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *     responses:
 *       200:
 *         description: User created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
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
userRouter.post('/signup', async (req,res) => {
  const { email, password, firstName, lastName } = req.body
  try {
    await client.query('INSERT INTO users (email, password, firstName, lastName) VALUES ($1, $2, $3, $4)', [email, password, firstName, lastName])
    const userItem = await client.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password])
    const userId = userItem.rows[0].id
    const token = jwt.sign({ userId },JWT_SECRET)
    res.status(200).json({
      message : "Signed Up Successfully",
      token
    })
  } catch (error) {
    res.status(500).json({ error : "Internal Server Error"})
  }
})

/**
 * @swagger
 * /user/post:
 *   post:
 *     summary: Login into your account
 *     description: Login into you account with the provided details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
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
userRouter.post('/login', async (req,res) => {
  const { email, password } = req.body
  try {
    const userItem = await client.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password])
    const userId = userItem.rows[0].id
    const token = jwt.sign({ userId },JWT_SECRET)
    res.status(200).json({
      message : "Logged In Successfully",
      token
    })
  } catch (error) {
    res.status(500).json({ error : "Internal Server Error"})
  }
})

module.exports = userRouter