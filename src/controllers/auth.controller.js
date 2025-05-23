const User = require("../models/Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(403).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.SECRET_JWT_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Función para crear el refresh token

const createTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user.id, username: user.username },
    process.env.SECRET_JWT_KEY,
    { expiresIn: "15m" } // Access token con vida de 15 minutos
  );

  const refreshToken = jwt.sign(
    { id: user.id, username: user.username },
    process.env.SECRET_JWT_KEY,
    { expiresIn: "7d" } // Refresh token con vida de 7 días
  );

  return { accessToken, refreshToken };
};

const createUser = async (req, res, next) => {
  try {
    //Informacion del usuario ingresada
    const { username, password, name, last_name } = req.body;

    //Verificar si ya existe el usuario
    const existingUser = await User.findOne({ where: { username } });
    console.log(existingUser);
    if (existingUser) {
      return res.status(400).json({ message: "El usuario ya existe" });
    } else {
      //Hashear la contrasena
      const hashedPassword = await bcrypt.hash(password, 10);

      //Crear usuario
      const user = await User.create({
        username,
        password: hashedPassword,
        name,
        last_name,
      });

      res.status(201).json({ message: "Usuario registrado", userId: user.id });
    }
  } catch (err) {
    res.status(500).json({ message: "Error del servidor", error: err.message });
  }
};

const loginUser = async (req, res, next) => {
  try {
    //Informacion del usuario ingresada
    const { username, password } = req.body;

    //Verificar que el usuario este registrado
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: "Username does not exist" });
    } else {
      //Verificar si la contrasena es correcta
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Password is invalid" });
      } else {
        // Creacion del Token
        const { accessToken, refreshToken } = createTokens(user);
        //Creacion de la Cookie, para almacenar el refresh token
        res.cookie("refresh_token", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 1000 * 60 * 60,
          path: "/",
        });
        //Enviar accesstoken al cliente
        res.json({ message: "Login exitoso", accessToken, userId: user.id });
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Error del servidor", error: err.message });
  }
};

const logoutUser = async (req, res, next) => {
  //Eliminamos la cookie
  res.clearCookie("refresh_token");
  res.json({ message: "Sesión cerrada" });
};

// Función para verificar el refresh token y generar un nuevo access token
const refreshAccessToken = async (req, res) => {
  const refreshToken = req.cookies.refresh_token;

  if (!refreshToken) {
    return res.status(403).json({ message: "No refresh token proporcionado" });
  }

  try {
    // Verificar el refresh token
    const decoded = jwt.verify(refreshToken, process.env.SECRET_JWT_KEY);

    // Si el refresh token es válido, generar un nuevo access token
    const user = await User.findOne({ where: { id: decoded.id } });

    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    const { accessToken } = createTokens(user);

    res.json({ accessToken });
  } catch (err) {
    res
      .status(401)
      .json({ message: "Refresh token inválido", error: err.message });
  }
};

module.exports = {
  verifyToken,
  refreshAccessToken,
  createUser,
  loginUser,
  logoutUser,
};
