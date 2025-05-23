const {
  Product,
  ProductInternalData,
  ProductMarketplaceData,
} = require("./models"); // Ajusta según tu estructura

async function seedProductsWithDetails() {
  const products = [
    { product_code: "P001", name: "Monitor LED 24" },
    { product_code: "P002", name: "Teclado Mecánico RGB" },
    { product_code: "P003", name: "Mouse Inalámbrico" },
    { product_code: "P004", name: "USB" },
    { product_code: "P005", name: "Control" },
  ];

  // Insertar productos
  const createdProducts = await Product.bulkCreate(products, {
    returning: true,
  });

  // Insertar datos internos y marketplace
  for (const product of createdProducts) {
    await ProductInternalData.create({
      product_id: product.id,
      iva: 0.19,
      costo: 120.0 + product.id * 10,
    });

    await ProductMarketplaceData.create({
      product_id: product.id,
      original_price: 200.0 + product.id * 10,
      price: 180.0 + product.id * 10,
      title: product.name,
      comision: 10.5,
      costo_envio: 15.0,
    });
  }

  console.log("Productos y datos relacionados insertados correctamente");
}

seedProductsWithDetails()
  .then(() => process.exit())
  .catch((err) => {
    console.error("Error en seeder:", err);
    process.exit(1);
  });
