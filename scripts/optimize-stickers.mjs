import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const stickersDir = path.join(__dirname, '../public/stickers');

async function optimizeStickers() {
  console.log('Optimizing sticker images to WebP...\n');

  const files = fs.readdirSync(stickersDir).filter(f => f.endsWith('.jpg'));

  for (const file of files) {
    const inputPath = path.join(stickersDir, file);
    const outputPath = path.join(stickersDir, file.replace('.jpg', '.webp'));

    const stats = fs.statSync(inputPath);
    const sizeBefore = stats.size;

    await sharp(inputPath)
      .webp({ quality: 80 })
      .toFile(outputPath);

    const statsAfter = fs.statSync(outputPath);
    const sizeAfter = statsAfter.size;
    const reduction = Math.round((1 - sizeAfter / sizeBefore) * 100);

    console.log(`✅ ${file} → ${file.replace('.jpg', '.webp')}`);
    console.log(`   Before: ${Math.round(sizeBefore / 1024)}KB | After: ${Math.round(sizeAfter / 1024)}KB | Reduction: ${reduction}%\n`);
  }
}

optimizeStickers().catch(console.error);
