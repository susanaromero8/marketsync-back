const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const productsRoutes = require("./src/routes/products.routes");
const authRoutes = require("./src/routes/auth.routes");
const app = express();

// Habilita CORS para permitir conexión con el frontend en localhost:5173
app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true, 
  })
);

// Middleware para logs de peticiones
app.use(morgan("dev"));

// Middleware para parsear JSON
app.use(express.json());

// Middleware para parsear cookies
app.use(cookieParser());

// Rutas de la API
app.use("/api/products", productsRoutes);
app.use("/api/auth", authRoutes);

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  return res.json({
    message: err.message,
  });
});

//Puerto
const PORT = process.env.PORT || 3000;

//Servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
