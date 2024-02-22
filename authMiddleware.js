const { JWT_SECRET } = require("./config")
const jwt = require("jsonwebtoken")

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization
  if (!token) {
    return res.status(403).json({
      message: "Authentication failed",
    })
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.userId = decoded.userId
    next()
  } catch (err) {
    return res.status(403).json({
      message: "Authentication failed",
    })
  }
}

module.exports = authMiddleware