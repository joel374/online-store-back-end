const db = require("../models")
const Cart = db.Cart

const cartController = {
  addToCart: async (req, res) => {
    const { ProductId, quantity } = req.body

    const addProductToCart = await Cart.create({
      UserId: req.user.id,
      ProductId: ProductId,
    })

    const findCart = await Cart.findByPk(addProductToCart.id, {
      include: [{ models: db.Product }],
    })

    return res.status(200).json({
      message: "Product added to cart",
      data: findCart,
    })
  },
}

module.exports = { cartController }
