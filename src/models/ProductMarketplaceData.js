const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ProductMarketplaceData = sequelize.define(
  "ProductMarketplaceData",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    product_id: {
      type: DataTypes.INTEGER,
      unique: true,
      references: {
        model: "products",
        key: "id",
      },
    },
    original_price: {
      type: DataTypes.DECIMAL(10, 2),
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
    },
    title: {
      type: DataTypes.STRING(100),
    },
    comision: {
      type: DataTypes.DECIMAL(10, 2),
    },
    costo_envio: {
      type: DataTypes.DECIMAL(10, 2),
    },
    stock: {
      type: DataTypes.INTEGER,
    },
    marketplace_name: {
      type: DataTypes.STRING(100),
    },
    sold_quantity: {
      type: DataTypes.INTEGER,
    },
    rating: {
      type: DataTypes.DECIMAL(3, 2),
    },
    reviews_count: {
      type: DataTypes.INTEGER,
    },
    listing_date: {
      type: DataTypes.DATE,
    },
    last_updated: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "product_marketplace_data",
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = ProductMarketplaceData;
