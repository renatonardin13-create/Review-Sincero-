import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { Storage } from '@google-cloud/storage';

const router = Router();
const storageClient = new Storage();
const bucketName = process.env.GCS_BUCKET || 'review-sincero-media';
const bucket = storageClient.bucket(bucketName);

// Middleware de autenticação básica para admin
const adminAuth = (req: Request, res: Response, next: NextFunction) => {
  const authEmail = req.headers['x-admin-email'] as string;
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'renatonardin13@gmail.com';
  
  if (authEmail && authEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Acesso negado.' });
  }
};

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não permitido.'));
    }
  }
});

async function getConfig() {
  try {
    const file = bucket.file('login-media/config.json');
    const [content] = await file.download();
    return JSON.parse(content.toString());
  } catch (e) {
    return { activeBackground: 'default', backgroundImage: '', backgroundVideo: '' };
  }
}

async function saveConfig(config: any) {
  const file = bucket.file('login-media/config.json');
  await file.save(JSON.stringify(config), { contentType: 'application/json' });
}

router.get("/login-media", async (req, res) => {
  const config = await getConfig();
  res.json(config);
});

router.post("/login-media", adminAuth, upload.single('media'), async (req, res) => {
  const { activeBackground } = req.body;
  const file = req.file;
  const config = await getConfig();
  
  if (file) {
    const fileName = `login-media/${file.mimetype.startsWith('image') ? 'images' : 'videos'}/${Date.now()}-${file.originalname}`;
    const blob = bucket.file(fileName);
    await blob.save(file.buffer, { contentType: file.mimetype });
    const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
    
    if (file.mimetype.startsWith('image')) {
      config.backgroundImage = publicUrl;
    } else if (file.mimetype.startsWith('video')) {
      config.backgroundVideo = publicUrl;
    }
  }
  
  config.activeBackground = activeBackground;
  await saveConfig(config);
  res.json({ success: true, config });
});

router.delete("/login-media", adminAuth, async (req, res) => {
  const { type } = req.body;
  const config = await getConfig();
  
  if (type === 'image' && config.backgroundImage) {
      config.backgroundImage = '';
  } else if (type === 'video' && config.backgroundVideo) {
      config.backgroundVideo = '';
  }
  
  await saveConfig(config);
  res.json({ success: true, config });
});

export default router;
