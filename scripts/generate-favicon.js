const fs = require('fs');
const path = require('path');

// Create assets directory if it doesn't exist
const assetsDir = path.join(__dirname, '..', 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Copy icon.png to favicon.png
const iconPath = path.join(assetsDir, 'icon.png');
const faviconPath = path.join(assetsDir, 'favicon.png');

if (fs.existsSync(iconPath)) {
  fs.copyFileSync(iconPath, faviconPath);
  console.log('Favicon generated successfully');
} else {
  console.log('Warning: icon.png not found, skipping favicon generation');
} 