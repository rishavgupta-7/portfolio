import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '../../uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${baseName}-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedExts = /jpeg|jpg|png|webp|svg|gif|avif|mp4|webm|mov|ogg|mkv/;
  const extname = allowedExts.test(path.extname(file.originalname).toLowerCase());
  const isImageOrVideo =
    file.mimetype.startsWith('image/') ||
    file.mimetype.startsWith('video/') ||
    file.mimetype === 'application/octet-stream';

  if (extname || isImageOrVideo) {
    return cb(null, true);
  }
  cb(new Error('Only image (JPEG, PNG, WEBP, SVG, GIF, AVIF) and video (MP4, WEBM, MOV, OGG, MKV) files are allowed!'));
};

export const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit for high-res images & video clips
  fileFilter,
});
