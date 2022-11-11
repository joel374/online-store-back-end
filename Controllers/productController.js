const db = require("../models")
const Product = db.Product

const productController = {
  getAllProduct: async (req, res) => {
    try {
      const response = await Product.findAll({
        include: [{ model: db.Seller }],
      })

      return res.status(200).json({
        message: "Get All Product",
        data: response,
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        message: "Server Error",
      })
    }
  },
  addNewProduct: async (req, res) => {
    try {
      const { image, product_name, condition, description, price, stock } =
        req.body

      const findSellerId = await db.User.findOne({
        include: [{ model: db.Seller }],
        where: {
          id: req.user.id,
        },
      })

      const findSellerByIdParse = JSON.parse(JSON.stringify(findSellerId))

      const newProduct = await Product.create({
        SellerId: findSellerByIdParse.Sellers[0].id,
        image,
        product_name,
        condition,
        description,
        price,
        stock,
      })

      return res.status(200).json({
        message: "Product Added",
        data: newProduct,
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        message: "Server Error",
      })
    }
  },
}

module.exports = { productController }
