const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ProductInternalData = sequelize.define(
  "ProductInternalData",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    product_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "products",
        key: "id",
      },
    },
    iva: {
      type: DataTypes.DECIMAL(5, 2),
    },
    costo: {
      type: DataTypes.DECIMAL(10, 2),
    },
  },
  {
    tableName: "product_internal_data",
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = ProductInternalData;
