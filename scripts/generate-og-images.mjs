import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '../public');

async function generateOGImages() {
  console.log('Generating OG and Twitter images...');

  // Use the Mbappe image as base
  const sourceImage = path.join(publicDir, 'stickers', 'mbappe.jpg');

  // Generate OG image (1200x630)
  await sharp(sourceImage)
    .resize(1200, 630, {
      fit: 'cover',
      position: 'center',
    })
    .png()
    .toFile(path.join(publicDir, 'og-image.png'));
  console.log('✅ Created og-image.png (1200x630)');

  // Generate Twitter image (1024x512)
  await sharp(sourceImage)
    .resize(1024, 512, {
      fit: 'cover',
      position: 'center',
    })
    .png()
    .toFile(path.join(publicDir, 'twitter-image.png'));
  console.log('✅ Created twitter-image.png (1024x512)');
}

generateOGImages().catch(console.error);
