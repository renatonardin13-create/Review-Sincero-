import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();
const upload = multer({ 
  dest: 'public/uploads/',
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'video/mp4'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não permitido.'));
    }
  }
});

const CONFIG_FILE = 'public/uploads/config.json';

router.get("/login-media", (req, res) => {
  if (fs.existsSync(CONFIG_FILE)) {
    const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
    res.json(config);
  } else {
    res.json({ activeBackground: 'default', backgroundImage: '', backgroundVideo: '' });
  }
});

router.post("/login-media", upload.single('media'), (req, res) => {
  const { activeBackground } = req.body;
  const file = req.file;
  const config = fs.existsSync(CONFIG_FILE) ? JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8')) : {};
  
  if (file) {
    if (file.mimetype.startsWith('image')) {
      config.backgroundImage = `/uploads/${file.filename}`;
    } else if (file.mimetype.startsWith('video')) {
      config.backgroundVideo = `/uploads/${file.filename}`;
    }
  }
  
  config.activeBackground = activeBackground;
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config));
  res.json({ success: true, config });
});

export default router;
