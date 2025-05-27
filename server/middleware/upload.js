import multer from "multer";

const storage = multer.memoryStorage(); // Храним файлы в памяти

const uploadArray = multer({
  storage,
  limits: { files: 10 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Только изображения разрешены!"));
    }
    cb(null, true);
  },
}).array("images", 10);

const uploadSingle = multer({
  storage,
  limits: { files: 1 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Только изображения разрешены!"));
    }
    cb(null, true);
  },
}).single("avatar");

export { uploadSingle, uploadArray };