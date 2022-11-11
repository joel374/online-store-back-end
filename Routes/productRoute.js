const express = require("express")
const router = express.Router()

const { productController } = require("../Controllers/productController")
const { verifyToken } = require("../middlewares/userMiddleware")

router.get("/getAllProduct", productController.getAllProduct)
router.post("/addNewProduct", verifyToken, productController.addNewProduct)

module.exports = router
