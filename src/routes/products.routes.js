const { Router } = require("express");
const { verifyToken } = require("../controllers/auth.controller");
const {
  syncProduct,
  getProductById,
  upsertProduct,
} = require("../controllers/product.controller");

const router = Router();

// 🔄 Ruta para sincronizar productos desde el marketplace externo y retornar la data actualizada
router.get("/sync", verifyToken, syncProduct);

// 🔄 Ruta para sincronizar un producto desde el marketplace externo por su Id y retornar la data actualizada del producto
router.get("/:id", verifyToken, getProductById);

// 🛠️ Ruta para actualizar datos del marketplace
router.put("/update-marketplace", verifyToken, upsertProduct);

module.exports = router;
