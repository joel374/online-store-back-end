const db = require("../models")
const Image_slider = db.Image_slider
// const { ImageSlider } = db

const imageSliderController = {
  getAllImage: async (req, res) => {
    try {
      const getAllImageSlide = await Image_slider.findAll()

      return res.status(200).json({
        message: "Show All Image",
        data: getAllImageSlide,
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        message: "Server error",
      })
    }
  },
}

module.exports = {
  imageSliderController,
}
