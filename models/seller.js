"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Seller extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Seller.hasMany(models.Product)
      Seller.belongsTo(models.User)
    }
  }
  Seller.init(
    {
      shop_name: DataTypes.STRING,
      shop_address: DataTypes.STRING,
      account_number: DataTypes.STRING,
      photo_profile: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Seller",
    }
  )
  return Seller
}
