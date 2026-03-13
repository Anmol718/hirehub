const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { v2: cloudinary } = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "hirehub_DEV",
    allowedFormats: ["pdf"],
    resource_type: "raw", // important for PDFs
  },
});

module.exports = {
  cloudinary,
  storage,
};
