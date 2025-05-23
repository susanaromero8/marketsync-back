const axios = require("axios");
const {
  Product,
  ProductMarketplaceData,
  ProductInternalData,
} = require("../models");

const syncProduct = async (req, res) => {
  console.log("📡 Solicitando productos al marketplace externo...");
  try {
    const { data } = await axios.get(
      "http://localhost:4000/marketplace/products"
    );

    await Promise.all(
      data.items.map(async (item) => {
        // Crea o busca producto principal
        const [product] = await Product.findOrCreate({
          where: { product_code: item.product },
          defaults: { name: item.title },
        });

        // Upsert en datos del marketplace
        await ProductMarketplaceData.upsert({
          product_id: product.id,
          original_price: item.originalprice,
          price: item.price,
          title: item.title,
          comision: item.comision,
          costo_envio: item.costoenvio,
          stock: item.stock,
          marketplace_name: item.marketplace_name,
          sold_quantity: item.sold_quantity,
          rating: item.rating,
          reviews_count: item.reviews_count,
          listing_date: item.listing_date,
        });
      })
    );
    // Devuelve todos los productos con sus datos relacionados
    const products = await Product.findAll({
      include: [
        { model: ProductMarketplaceData, as: "marketplaceData" },
        { model: ProductInternalData, as: "internalData" },
      ],
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar el producto localmente por su ID
    const product = await Product.findOne({
      where: { id },
      include: [
        { model: ProductMarketplaceData, as: "marketplaceData" },
        { model: ProductInternalData, as: "internalData" },
      ],
    });

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    // Usar el product_code para llamar a la API externa
    const { data: externalData } = await axios.get(
      `http://localhost:4000/marketplace/products/${product.product_code}`
    );

    // 🔄 Actualizar ProductMarketplaceData con los datos más recientes
    await ProductMarketplaceData.update(
      {
        original_price: externalData.originalprice,
        price: externalData.price,
        title: externalData.title,
        comision: externalData.comision,
        costo_envio: externalData.costoenvio,
        stock: externalData.stock,
        marketplace_name: externalData.marketplace_name,
        sold_quantity: externalData.sold_quantity,
        rating: externalData.rating,
        reviews_count: externalData.reviews_count,
        listing_date: externalData.listing_date,
        last_updated: new Date(),
      },
      {
        where: { product_id: product.id },
      }
    );

    // Refetch actualizado
    const updatedProduct = await Product.findOne({
      where: { id },
      include: [
        { model: ProductMarketplaceData, as: "marketplaceData" },
        { model: ProductInternalData, as: "internalData" },
      ],
    });

    res.json({
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const upsertProduct = async (req, res) => {
  try {
    const payload = req.body;

    if (!payload || !payload.product) {
      return res.status(400).json({ error: "Payload inválido" });
    }

    // Enviar actualización al mock del marketplace externo
    await axios.post("http://localhost:4000/marketplace/update", {
      product: payload,
    });

    const product = await Product.findOne({
      where: { product_code: payload.product },
    });

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    //Actualizar data de marketplace interna
    await ProductMarketplaceData.update(
      {
        original_price: payload.originalprice,
        price: payload.price,
        title: payload.title,
        comision: payload.comision,
        costo_envio: payload.costoenvio,
        stock: payload.stock,
        marketplace_name: payload.marketplace_name,
        sold_quantity: payload.sold_quantity,
        rating: payload.rating,
        reviews_count: payload.reviews_count,
        listing_date: payload.listing_date,
        last_updated: new Date(),
      },
      {
        where: { product_id: product.id },
      }
    );

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  syncProduct,
  getProductById,
  upsertProduct,
};
