const Listing = require("../models/listing");
const User = require("../models/user");
const aktuSubjects = require("../utils/aktuSubjects");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
<<<<<<< HEAD
const { cloudinary } = require("../cloudConfig");
=======
>>>>>>> d8613dbed0f7b47af0d6e3c01e44b8f82ced0b96

module.exports.home = (req, res) => {
  res.render("home");
};

module.exports.chooseClass = (req, res) => {
  const { year } = req.query;
  if (year === "First") {
    return res.render("chooseClass");
  }
  res.render("chooseBranch", { year });
};

module.exports.chooseType = (req, res) => {
  const { year, branch } = req.params;
  const { section } = req.query;
  res.render("chooseType", { year, branch, section: section || "" });
};

module.exports.chooseSubject = (req, res) => {
  const { year, branch } = req.params;
  const { type, section } = req.query;
  const currentSubjects = aktuSubjects[year];
  res.render("chooseSubject", { year, branch, type, currentSubjects, section: section || "" });
};

module.exports.chooseUnit = (req, res) => {
  const { year, branch } = req.params;
  const { type, subject, section } = req.query;
  res.render("units", { year, branch, type, subject, section: section || "" });
};

module.exports.showListings = wrapAsync(async (req, res) => {
  const { year, branch } = req.params;
  const { type, subject, unit, section } = req.query;

  let filter = { year };
  if (year !== "First") filter.branch = branch;
  if (type) filter.type = { $regex: type, $options: "i" };
  if (subject) filter.subject = subject;
  if (unit) filter.title = { $regex: unit, $options: "i" };
  if (section && section !== "ALL" && year === "First") filter.section = section;

  const data = await Listing.find(filter)
    .sort({ views: -1 })
    .populate("owner", "username");

  res.render("show", { data, year, branch, type, subject, unit, section: section || "" });
});

module.exports.showResource = wrapAsync(async (req, res) => {
  const { id } = req.params;
  const item = await Listing.findByIdAndUpdate(
    id,
    { $inc: { views: 1 } },
    { new: true }
  ).populate("owner", "username");

  if (!item) throw new ExpressError("Resource not found", 404);
  res.render("resource", { item });
});

module.exports.renderNew = (req, res) => {
  res.render("new", { aktuSubjects });
};

function getFileUrl(file) {
  return file.secure_url || file.path || null;
}

module.exports.createListing = wrapAsync(async (req, res) => {
  if (!req.file) {
    req.flash("error", "Please upload a PDF file");
    return res.redirect("/new");
  }

  const newListing = new Listing(req.body);
  newListing.owner = req.userId;

  newListing.file = {
    url: getFileUrl(req.file),
    filename: req.file.filename || req.file.public_id || req.file.originalname,
  };

  if (req.body.year === "First") {
    newListing.branch = undefined;
  } else {
    newListing.section = undefined;
  }

  await newListing.save();

  await User.findByIdAndUpdate(req.userId, {
    $push: { listings: newListing._id },
  });

  req.flash("success", "Resource added successfully! 📚");
  res.redirect("/");
});

module.exports.renderEdit = wrapAsync(async (req, res) => {
  const { id } = req.params;
  const currResource = await Listing.findById(id);
  if (!currResource) throw new ExpressError("Resource not found", 404);
  res.render("edit", { currResource, aktuSubjects });
});

module.exports.updateListing = wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) throw new ExpressError("Resource not found", 404);

  if (req.file) {
    req.body.file = {
      url: getFileUrl(req.file),
      filename: req.file.filename || req.file.public_id || req.file.originalname,
    };
  }

  await Listing.findByIdAndUpdate(id, req.body, {
    runValidators: true,
    new: true,
  });

  req.flash("success", "Resource updated successfully! ✅");
  res.redirect(`/resource/${id}`);
});

<<<<<<< HEAD
=======
const { cloudinary } = require("../cloudConfig");

>>>>>>> d8613dbed0f7b47af0d6e3c01e44b8f82ced0b96
module.exports.deleteListing = wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Resource not found");
    return res.redirect("/");
  }
<<<<<<< HEAD

  if (listing.file && listing.file.filename) {
    // Determine resource_type from the stored URL so both old (image) and new (raw) files delete correctly
    const storedUrl = listing.file.url || "";
    const resType = storedUrl.includes("/image/upload/") ? "image" : "raw";
    try {
      await cloudinary.uploader.destroy(listing.file.filename, { resource_type: resType });
    } catch (e) {
      console.error("Cloudinary delete error:", e.message);
      // Non-fatal — still delete the DB record
    }
  }

=======
  if (listing.file && listing.file.filename) {
    await cloudinary.uploader.destroy(listing.file.filename, {
      resource_type: "raw"
    });
  }
>>>>>>> d8613dbed0f7b47af0d6e3c01e44b8f82ced0b96
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Resource deleted successfully 🗑️");
  res.redirect("/");
});
