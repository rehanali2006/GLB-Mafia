const jwt = require("jsonwebtoken");
const { resourceSchema, loginSchema, signupSchema } = require("./schemaValidation");
const ExpressError = require("./utils/ExpressError");
const User = require("./models/user");

module.exports.validateResource = (req, res, next) => {
  const { error } = resourceSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const msg = error.details.map((el) => el.message).join(", ");
    req.flash("error", msg);
    return res.redirect("back");
  }

  next();
};

module.exports.validateLogin = (req, res, next) => {
  const { error } = loginSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const msg = error.details.map((el) => el.message).join(", ");
    req.flash("error", msg);
    return res.redirect("/auth/login");
  }

  next();
};

module.exports.validateSignup = (req, res, next) => {
  const { error } = signupSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const msg = error.details.map((el) => el.message).join(", ");
    req.flash("error", msg);
    return res.redirect("/auth/signup");
  }

  next();
};

module.exports.isAuthenticated = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    req.flash("error", "You must be logged in to do that!");
    return res.redirect("/auth/login");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch {
    req.flash("error", "Session expired. Please log in again.");
    res.clearCookie("token");
    return res.redirect("/auth/login");
  }
};

module.exports.loadUser = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      res.locals.currentUser = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    req.userId = decoded.id;
    req.userRole = decoded.role;
    req.user = user;

    res.locals.currentUser = user || null;
  } catch {
    res.locals.currentUser = null;
  }

  next();
};

module.exports.isAdmin = (req, res, next) => {
  if (req.userRole !== "admin") {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect("/");
  }
  next();
};

module.exports.isOwnerOrAdmin = async (req, res, next) => {
  try {
    const Listing = require("./models/listing");
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      req.flash("error", "Resource not found");
      return res.redirect("/");
    }

    if (
      req.userRole === "admin" ||
      (listing.owner && listing.owner.equals(req.userId))
    ) {
      return next();
    }

    req.flash("error", "You don't have permission to modify this resource");
    return res.redirect("/");
  } catch {
    req.flash("error", "Something went wrong");
    return res.redirect("/");
  }
};