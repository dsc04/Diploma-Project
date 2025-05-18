// middleware/upload.js
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

// Получаем текущую директорию, потому что ты, похоже, используешь ES-модули
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // уникальное имя
  },
});

const upload = multer({ storage });

export default upload;
