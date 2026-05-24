// Re-exports cloudinary instance from cloudConfig to avoid duplicate configuration
const { cloudinary } = require("../cloudConfig");
module.exports = cloudinary;
