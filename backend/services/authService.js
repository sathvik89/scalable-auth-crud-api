const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


async function registerUser({ name, email, password, role }) {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const resolvedRole = String(role || "").trim().toLowerCase();
  if (resolvedRole !== "admin" && resolvedRole !== "user") {
    throw new Error("Invalid role");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const displayName = String(name).trim();

  await User.create({
    name: displayName,
    email,
    password: hashedPassword,
    role: resolvedRole,
  });

  return { message: "User registered successfully" };
}

async function loginUser({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const check = await bcrypt.compare(password, user.password);
  if (!check) {
    throw new Error("Invalid password");
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );

  return {
    token,
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
    },
  };
}

module.exports = { registerUser, loginUser };
