const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
<<<<<<< HEAD
  params: async (req, file) => {
    const isPDF = file.mimetype === "application/pdf";

    return {
      folder: "GLB_MAFIA",

      // ✅ CRITICAL FIX
      resource_type: isPDF ? "raw" : "auto",

      allowed_formats: [
        "pdf", "png", "jpg", "jpeg",
        "doc", "docx", "ppt", "pptx"
      ],

      public_id: Date.now() + "-" + file.originalname,
    };
=======
  params: {
    folder: "GLB_MAFIA",
    resource_type: "auto", 
>>>>>>> d8613dbed0f7b47af0d6e3c01e44b8f82ced0b96
  },
});

module.exports = {
  cloudinary,
  storage,
};