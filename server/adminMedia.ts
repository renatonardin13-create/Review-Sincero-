import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { Storage } from '@google-cloud/storage';

const router = Router();
const storageClient = new Storage();
const bucketName = process.env.GCS_BUCKET;
const isProduction = process.env.NODE_ENV === 'production';

if (!bucketName && isProduction) {
  console.error('ERRO: GCS_BUCKET_NOT_CONFIGURED');
  throw new Error('GCS_BUCKET_NOT_CONFIGURED');
}

const bucket = bucketName ? storageClient.bucket(bucketName) : null;

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
  if (!bucket) return { activeBackground: 'default', backgroundImage: '', backgroundVideo: '' };
  try {
    console.log('Attempting to download config from:', `login-media/config.json`);
    const file = bucket.file('login-media/config.json');
    const [content] = await file.download();
    const config = JSON.parse(content.toString());
    console.log('Config loaded:', config);
    return config;
  } catch (e) {
    console.error('Error loading config:', e);
    return { activeBackground: 'default', backgroundImage: '', backgroundVideo: '' };
  }
}

async function saveConfig(config: any) {
  if (!bucket) {
    console.warn('GCS não configurado, salvamento ignorado.');
    return;
  }
  try {
    console.log('Attempting to save config:', config);
    const file = bucket.file('login-media/config.json');
    await file.save(JSON.stringify(config), { contentType: 'application/json' });
    console.log('Config saved successfully');
  } catch (e) {
    console.error('Error saving config:', e);
    throw e; // Propagar erro para o frontend ver
  }
}

router.get("/login-media", async (req, res) => {
  const config = await getConfig();
  res.json(config);
});

router.post("/login-media", adminAuth, (req, res, next) => {
  if (req.is('multipart/form-data')) {
    return upload.single('media')(req, res, next);
  }
  next();
}, async (req, res) => {
  const { activeBackground, youtubeUrl } = req.body;
  const file = req.file;
  const config = await getConfig();
  
  if (file && bucket) {
    const fileName = `login-media/${file.mimetype.startsWith('image') ? 'images' : 'videos'}/${Date.now()}-${file.originalname}`;
    const blob = bucket.file(fileName);
    await blob.save(file.buffer, { contentType: file.mimetype });
    const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
    
    if (file.mimetype.startsWith('image')) {
      config.backgroundImage = publicUrl;
    } else if (file.mimetype.startsWith('video')) {
      config.backgroundVideo = publicUrl;
      config.youtubeUrl = ''; // Limpa YouTube se upload novo
    }
  } else if (youtubeUrl) {
    config.backgroundVideo = ''; // Limpa vídeo upload se youtube novo
    config.youtubeUrl = youtubeUrl;
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
