#!/usr/bin/env node
/**
 * build.js — Vercel build script
 * Replaces %%VITE_API_URL%% placeholder in all HTML files
 * with the actual VITE_API_URL environment variable.
 *
 * Set in Vercel dashboard:
 *   VITE_API_URL = https://your-paycoinads-backend.onrender.com
 */

const fs = require('fs');
const path = require('path');

const API_URL = process.env.VITE_API_URL || '';

if (!API_URL) {
    console.warn('⚠️  VITE_API_URL is not set! API calls will use relative /api paths.');
}

console.log(`🔧 Injecting API_URL: ${API_URL || '(empty — relative URLs)'}`);

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            walkDir(fullPath);
        } else if (file.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes('%%VITE_API_URL%%')) {
                content = content.replaceAll('%%VITE_API_URL%%', API_URL);
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`  ✅ Patched: ${fullPath}`);
            }
        }
    });
}

walkDir(path.join(__dirname, 'public'));
console.log('✅ Build complete!');
