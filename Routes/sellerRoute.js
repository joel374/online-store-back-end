const express = require("express")
const { sellerController } = require("../Controllers/sellerController")
const { verifyToken } = require("../middlewares/userMiddleware")
const router = express.Router()

router.post("/addNewSeller", sellerController.AddNewSeller)

module.exports = router
