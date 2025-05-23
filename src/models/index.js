const Product = require("./Product");
const ProductMarketplaceData = require("./ProductMarketplaceData");
const ProductInternalData = require("./ProductInternalData");

Product.hasOne(ProductMarketplaceData, {
  foreignKey: "product_id",
  as: "marketplaceData",
});

ProductMarketplaceData.belongsTo(Product, {
  foreignKey: "product_id",
});

Product.hasOne(ProductInternalData, {
  foreignKey: "product_id",
  as: "internalData",
});

ProductInternalData.belongsTo(Product, {
  foreignKey: "product_id",
});

module.exports = {
  Product,
  ProductMarketplaceData,
  ProductInternalData,
};
