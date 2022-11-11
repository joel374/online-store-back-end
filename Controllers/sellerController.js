const db = require("../models")
const { Op } = require("sequelize")
const bcrypt = require("bcrypt")

const Seller = db.Seller

const sellerController = {
  AddNewSeller: async (req, res) => {
    try {
      const findSellerById = await db.Seller.findOne({
        where: {
          UserId: req.user.id,
        },
      })

      if (findSellerById) {
        return res.status(400).json({
          message: "Seller has been added",
        })
      }

      const { shop_name, shop_address } = req.body

      const findShopName = await db.Seller.findOne({
        where: {
          shop_name: shop_name,
        },
      })

      if (findShopName) {
        return res.status(400).json({
          message: "Shop name already exists",
        })
      }

      const seller = await Seller.create({
        UserId: req.user.id,
        shop_name,
        shop_address,
      })

      return res.status(200).json({
        message: "Add new Seller Succesfull",
        data: seller,
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        message: "Sever Error",
      })
    }
  },
}

module.exports = { sellerController }
