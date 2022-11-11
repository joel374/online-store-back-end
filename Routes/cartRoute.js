const express = require("express")
const { cartController } = require("../Controllers/cartController")
const { verifyToken } = require("../middlewares/userMiddleware")
const router = express.Router()

router.post("/addToCart", verifyToken, cartController.addToCart)

module.exports = router
