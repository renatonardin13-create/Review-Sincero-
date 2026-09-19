import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();

// Middleware de autenticação básica para admin
const adminAuth = (req: Request, res: Response, next: NextFunction) => {
  // Em uma implementação real, validaríamos o token do usuário.
  // Como o usuário é passado no contexto pelo frontend, aqui validamos via header.
  const authEmail = req.headers['x-admin-email'] as string;
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'renatonardin13@gmail.com';
  
  if (authEmail && authEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Acesso negado.' });
  }
};

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

router.post("/login-media", adminAuth, upload.single('media'), (req, res) => {
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

router.delete("/login-media", adminAuth, (req, res) => {
  const { type } = req.body;
  const config = fs.existsSync(CONFIG_FILE) ? JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8')) : {};
  
  if (type === 'image' && config.backgroundImage) {
      // Opcional: remover o arquivo físico
      config.backgroundImage = '';
  } else if (type === 'video' && config.backgroundVideo) {
      config.backgroundVideo = '';
  }
  
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config));
  res.json({ success: true, config });
});

export default router;
