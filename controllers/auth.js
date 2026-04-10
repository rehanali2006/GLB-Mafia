const jwt = require("jsonwebtoken");
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");


module.exports.renderSignup = (req, res) => {
  if (res.locals.currentUser) return res.redirect("/");
  res.render("auth/signup");
};


module.exports.signup = wrapAsync(async (req, res) => {
  const { username, email, password } = req.body;

  const existing = await User.findOne({ $or: [{ email }, { username }] });
  if (existing) {
    req.flash("error", "Email or username already in use");
    return res.redirect("/auth/signup");
  }

  const user = new User({ username, email, password });
  await user.save();

  // Issue JWT
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  req.flash("success", `Welcome to GLB Mafia, ${user.username}! 🎉`);
  res.redirect("/");
});


module.exports.renderLogin = (req, res) => {
  if (res.locals.currentUser) return res.redirect("/");
  res.render("auth/login");
};

module.exports.login = wrapAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    req.flash("error", "Invalid email or password");
    return res.redirect("/auth/login");
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  req.flash("success", `Welcome back, ${user.username}! 👋`);
  res.redirect("/");
});

module.exports.logout = (req, res) => {
  res.clearCookie("token");
  req.flash("success", "Logged out successfully. See you soon!");
  res.redirect("/auth/login");
};
