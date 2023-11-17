const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("../models/user");

const { authSchema } = require("../routes/schemas/user");

const SECRET_KEY = process.env.SECRET_KEY;

async function register(req, res, next) {
  const body = authSchema.validate(req.body);
  const userBody = body.value;

  if (typeof body.error !== "undefined") {
    return res.status(400).json({
      message: body.error.details.map((err) => err.message).join(", "),
    });
  }

  const { password } = req.body;
  const hashPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = await User.create({ ...userBody, password: hashPassword });
    res.status(201).json({
      user: { email: newUser.email, subscription: newUser.subscription },
    });
  } catch (err) {
    if (err.name === "MongoServerError" && err.code === 11000) {
      return res.status(409).json({ message: "Email in use" });
    }
    next(err);
  }
}

async function login(req, res, next) {
  const body = authSchema.validate(req.body);

  if (typeof body.error !== "undefined") {
    return res.status(400).json({
      message: body.error.details.map((err) => err.message).join(", "),
    });
  }

  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({
      message: "Email or password is wrong",
    });
  }

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    return res.status(401).json({
      message: "Email or password is wrong",
    });
  }
  const payload = { id: user._id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1d" });

  try {
    jwt.verify(token, SECRET_KEY);

    res.json({
      token,
      user: { email: user.email, subscription: user.subscription },
    });
  } catch (err) {
    next(err);
  }
}

async function current(req, res) {
  const { email, subscription } = req.user;
  res.json({
    email,
    subscription,
  });
}

async function logout(req, res) {
  const { email, subscription } = req.user;
  res.json({
    email,
    subscription,
  });
}

module.exports = {
  register,
  login,
  current,
  logout
};
