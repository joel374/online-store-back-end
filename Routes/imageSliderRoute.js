const express = require("express")
const {
  imageSliderController,
} = require("../Controllers/imageSliderController")
const router = express.Router()

router.get("/imageSlide", imageSliderController.getAllImage)

module.exports = router
