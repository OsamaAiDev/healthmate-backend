const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file, cb) => {
    const fileExtension = file.originalname.split('.').pop().toLowerCase();
    const isImage = ['jpeg', 'png', 'jpg'].includes(fileExtension);
    const resource_type = isImage ? 'image' : 'raw';
    cb(null, {
      folder: 'HealthMate',
      resource_type: resource_type,
    });
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
