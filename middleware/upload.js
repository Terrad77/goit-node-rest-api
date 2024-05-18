import path from "node:path";
import crypto from "node:crypto";
import multer from "multer";

// Налаштування тимчасової директорії
const tmpDir = path.resolve("tmp"); // C:\Users\terlo\Documents\GitHub\goit-node-rest-api\tmp
console.log("tmpDir: " + tmpDir);

// Налаштування multer для завантаження файлів
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tmpDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = crypto.randomBytes(16).toString("hex");
    cb(null, `${name}${ext}`);
  },
});

// експорт та передача в multer сконфігурований storage
export default multer({ storage });
