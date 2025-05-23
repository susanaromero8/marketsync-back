const { loginSchema } = require("../schemas/loginSchema");
const { registerSchema } = require("../schemas/registerSchema");

const validateRequestRegister = (req, res, next) => {
  const result = registerSchema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.errors.map((e) => ({
      field: e.path[0],
      message: e.message,
    }));
    return res.status(400).json({ errors });
  }

  next();
};

const validateRequestLogin = (req, res, next) => {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.errors.map((e) => ({
      field: e.path[0],
      message: e.message,
    }));
    return res.status(400).json({ errors });
  }

  next();
};

module.exports = {
  validateRequestRegister,
  validateRequestLogin,
};
