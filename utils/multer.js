// This file is kept for reference but multer upload is configured in routes/listings.js via cloudConfig.js
// Using cloudConfig.js storage directly is the correct approach for this project
const multer = require("multer");
const { storage } = require("../cloudConfig");

module.exports = multer({ storage });
