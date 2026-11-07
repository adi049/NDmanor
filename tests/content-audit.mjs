import { readdir, readFile, access } from 'node:fs/promises';
import { join } from 'node:path';
import { galleryCategories, galleryItems } from '../src/data/gallery.js';
import { rooms, seoRoutes, site } from '../src/data/site.js';

const root = new URL('..', import.meta.url).pathname;
const failures = [];
const textExtensions = ['.js', '.jsx', '.css', '.html', '.json', '.md', '.xml', '.txt'];
const imageManifest = JSON.parse(await readFile(join(root, 'src/data/image-manifest.json'), 'utf8'));
const official = ((process.env.SITE_URL || site.domain || '')).replace(/\/$/, '');

async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (['node_modules', 'dist', '.git', 'test-results'].includes(entry.name)) continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await walk(path);
    else if (textExtensions.some((extension) => entry.name.endsWith(extension))) {
      const text = await readFile(path, 'utf8');
      if (text.includes('\u2014')) failures.push(`Em dash found in ${path}`);
      if (/javascript:void|href=["']#["']|lorem ipsum/i.test(text)) failures.push(`Placeholder or decorative link found in ${path}`);
      if (/https:\/\/www\.(instagram|facebook)\.com\//i.test(text)) failures.push(`Unverified social profile URL found in ${path}`);
      for (const url of text.match(/https?:\/\/[^"'\s)]*ndmanor\.com[^"'\s)]*/gi) || []) {
        if (!url.startsWith(`${official} `) && !url.startsWith(official)) failures.push(`Non-canonical domain form in ${path}: ${url}`);
      }
      if (/localhost|127\.0\.0\.1/.test(text) && !/test|spec|audit|scripts/i.test(path)) failures.push(`Local origin found in ${path}`);
    }
  }
}

await walk(join(root, 'src'));
await walk(join(root, 'public'));
const indexHtml = await readFile(join(root, 'index.html'), 'utf8');
if (indexHtml.includes('\u2014')) failures.push('Em dash found in index.html');
if (/https:\/\/www\.(instagram|facebook)\.com\//i.test(indexHtml)) failures.push('Unverified social profile URL found in index.html');
for (const url of indexHtml.match(/https?:\/\/[^"'\s)]*ndmanor\.com[^"'\s)]*/gi) || []) {
  if (!url.startsWith(official)) failures.push(`Non-canonical domain form in index.html: ${url}`);
}

for (const [name, entry] of Object.entries(imageManifest)) {
  if (!entry.width || !entry.height || !entry.sources?.length) failures.push(`Incomplete responsive manifest entry for ${name}`);
  for (const source of entry.sources || []) {
    try { await access(join(root, 'public', source.src)); } catch { failures.push(`Missing responsive image ${source.src}`); }
    if (source.width > entry.width) failures.push(`Upscaled responsive derivative for ${name}`);
    if (!source.width || !source.height) failures.push(`Missing dimensions for ${source.src}`);
  }
}

for (const item of galleryItems) {
  for (const path of [item.src, item.thumbnail]) {
    try { await access(join(root, 'public', path)); } catch { failures.push(`Missing gallery image ${path}`); }
  }
  if (!item.alt || !item.category || !item.caption) failures.push(`Incomplete gallery data for ${item.id}`);
  if (!imageManifest[item.id]) failures.push(`Gallery item is missing responsive sources: ${item.id}`);
}

for (const name of Object.keys(imageManifest)) {
  if (!galleryItems.some((item) => item.id === name)) failures.push(`Verified photograph is not used in the gallery: ${name}`);
}

const requiredGalleryCategories = ['All Photos', 'Exterior', 'Rooms', 'Interiors', 'Dining', 'Banquets'];
if (JSON.stringify(galleryCategories) !== JSON.stringify(requiredGalleryCategories)) failures.push('Gallery filters do not match the approved category system');
for (const item of galleryItems) {
  if (!requiredGalleryCategories.slice(1).includes(item.category)) failures.push(`Unapproved gallery category for ${item.id}: ${item.category}`);
}

const roomPhotoOwners = new Map();
const roomPrefixes = { 'deluxe-room': 'room-deluxe', 'super-deluxe-room': 'room-super-deluxe', 'family-room': 'room-family', 'royal-room': 'room-royal' };
for (const room of rooms) {
  const images = [...room.images, ...(room.image ? [room.image] : []), ...(room.heroImage ? [room.heroImage] : [])];
  for (const image of images) {
    for (const path of [image.src, image.thumbnail]) {
      try { await access(join(root, 'public', path)); } catch { failures.push(`Missing room image ${path}`); }
    }
    if (!image.alt) failures.push(`Missing room image alt text for ${room.slug}`);
    if (!image.src.startsWith(`/images/${roomPrefixes[room.slug]}`)) failures.push(`Non-category or non-room photograph assigned to ${room.slug}: ${image.src}`);
  }
  for (const image of room.images) {
    if (roomPhotoOwners.has(image.src)) failures.push(`Cross-category room photograph reuse: ${image.src} in ${roomPhotoOwners.get(image.src)} and ${room.slug}`);
    roomPhotoOwners.set(image.src, room.slug);
    const name = image.src.match(/\/images\/([^/]+)\.webp$/)?.[1];
    if (!imageManifest[name]) failures.push(`Room image is missing responsive sources: ${image.src}`);
  }
  if (room.photoPending && (room.image || room.images.length || room.heroImage || room.contextImage)) failures.push(`${room.slug} is pending but still references room, exterior, lobby or context photography`);
  if (room.contextImage) failures.push(`${room.slug} uses a prohibited context image`);
  if (room.photoPending && room.amenities.length) failures.push(`${room.slug} is marked pending but still publishes category amenities`);
  if (!room.photoPending && (!room.image || room.images.length < 1)) failures.push(`${room.slug} has no verified category photograph`);
}

if (new Set(galleryItems.map((item) => item.id)).size !== galleryItems.length) failures.push('Duplicate gallery asset IDs');
const paths = seoRoutes.map((route) => route.path);
if (new Set(paths).size !== paths.length) failures.push('Duplicate SEO routes');
const titles = seoRoutes.map((route) => route.title);
if (new Set(titles).size !== titles.length) failures.push('Duplicate page titles');

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`Content audit passed: ${seoRoutes.length} SEO routes, ${rooms.length} room pages, ${galleryItems.length} distinct gallery photographs and ${Object.keys(imageManifest).length} responsive image sets.`);
