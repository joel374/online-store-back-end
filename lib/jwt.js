const jwt = require("jsonwebtoken")

const SECRET_KEY = "joe123"

const signToken = (payload) => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "10d" })
}

const validateToken = (token) => {
  return jwt.verify(token, SECRET_KEY)
}

module.exports = {
  signToken,
  validateToken,
}
