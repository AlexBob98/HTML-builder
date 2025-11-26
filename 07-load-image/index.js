const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const app = express();
const PORT = 3000;

const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');

fs.mkdirSync(path.join(__dirname, 'public'), { recursive: true });
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

app.use(express.static(__dirname));
app.use('/uploads', express.static(UPLOADS_DIR));

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/upload', upload.single('photo'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Файл не загружен' });
  }

  const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedMimes.includes(req.file.mimetype)) {
    return res.status(400).json({ error: 'Разрешены только изображения (jpg, png, gif, webp)' });
  }

  const hash = crypto.randomBytes(16).toString('hex');
  const outputPath = path.join(UPLOADS_DIR, `${hash}.webp`);

  try {
    await sharp(req.file.buffer)
      .resize(800, 600, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(outputPath);

    res.json({ url: `/uploads/${hash}.webp` });
  } catch (err) {
    console.error('Ошибка обработки:', err);
    res.status(500).json({ error: 'Не удалось обработать изображение' });
  }
});

app.listen(PORT, () => {
  console.log(`\x1b[32mСервер запущен: http://localhost:${PORT}\x1b[37m`);
});