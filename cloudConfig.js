const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isPDF = file.mimetype === "application/pdf";

    return {
      folder: "GLB_MAFIA",
      resource_type: isPDF ? "raw" : "auto",

      allowed_formats: [
        "pdf",
        "png",
        "jpg",
        "jpeg",
        "doc",
        "docx",
        "ppt",
        "pptx",
      ],

      public_id: Date.now() + "-" + file.originalname,
    };
  },
});

module.exports = {
  cloudinary,
  storage,
};