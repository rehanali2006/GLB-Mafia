const express = require("express");
const router = express.Router();

const listingsController = require("../controllers/listings");
const {
  isAuthenticated,
  validateResource,
  isOwnerOrAdmin
} = require("../middleware");

const multer = require("multer");
const { storage } = require("../cloudConfig");
const upload = multer({ storage });

router.get("/", listingsController.home);

router.get("/home", listingsController.chooseClass);
router.get("/home/:year/:branch", listingsController.chooseType);
router.get("/home/:year/:branch/type", listingsController.chooseSubject);
router.get("/home/:year/:branch/units", listingsController.chooseUnit);
router.get("/home/:year/:branch/show", listingsController.showListings);

router.get("/resource/:id", listingsController.showResource);

router.get("/new", isAuthenticated, listingsController.renderNew);
router.post("/new", isAuthenticated, upload.single("file"), validateResource, listingsController.createListing);

router.get("/edit/:id", isAuthenticated, isOwnerOrAdmin, listingsController.renderEdit);
router.put("/edit/:id", isAuthenticated, isOwnerOrAdmin, upload.single("file"), validateResource, listingsController.updateListing);

router.delete("/delete/:id", isAuthenticated, isOwnerOrAdmin, listingsController.deleteListing);

module.exports = router;