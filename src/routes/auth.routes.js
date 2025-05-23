const { Router } = require("express");

const {
  createUser,
  verifyToken,
  loginUser,
  logoutUser,
  refreshAccessToken,
} = require("../controllers/auth.controller");
const {
  validateRequestRegister,
  validateRequestLogin,
} = require("../middlewares/validateRequest");

const router = Router();

router.post("/register", validateRequestRegister, createUser);

router.post("/login", validateRequestLogin, loginUser);

router.post("/logout", logoutUser);

router.post("/refresh", refreshAccessToken);

router.get("/protected", verifyToken, async (req, res) => {
  res.json({
    message: "Ruta protegida accedida correctamente",
    user: req.user,
  });
});

module.exports = router;
