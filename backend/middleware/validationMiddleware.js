function validateRegister(req, res, next) {
  const { name, email, password, role } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ message: "Name is required" });
  }
  if (!email || !email.trim()) {
    return res.status(400).json({ message: "Email is required" });
  }
  if (!password || !password.trim()) {
    return res.status(400).json({ message: "Password is required" });
  }

  if (!email.includes("@") || !email.includes(".")) {
    return res.status(400).json({ message: "Invalid email" });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters long" });
  }

  if (role != null && String(role).trim() !== "") {
    const r = String(role).trim().toLowerCase();
    if (r !== "user" && r !== "admin") {
      return res.status(400).json({ message: "Role must be user or admin" });
    }
  }

  next();
}

function validateLogin(req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email & password required" });
  }

  next();
}

module.exports = { validateRegister, validateLogin };
