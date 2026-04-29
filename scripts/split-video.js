/**
 * 4B1K Video Showcase — FFmpeg Split Script
 *
 * Reads timestamps.json + recording_meta.json produced by showcase.js,
 * then converts and splits the raw WebM into 5 presentation-quality MP4s.
 *
 * Prerequisites:
 *   - ffmpeg must be in PATH  (run: ffmpeg -version)
 *   - Run showcase.js first
 *
 * Usage:
 *   node scripts/split-video.js
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const VIDEO_DIR = path.join(ROOT, 'videos');

// ─── FIND FFMPEG ──────────────────────────────────────────────────────────────
function findFFmpeg() {
  // 1. Try PATH first
  try {
    execSync('ffmpeg -version', { stdio: 'pipe' });
    return 'ffmpeg';
  } catch { /* not in PATH */ }

  // 2. Winget install location (Windows)
  if (os.platform() === 'win32') {
    const wingetBase = path.join(os.homedir(), 'AppData', 'Local', 'Microsoft', 'WinGet', 'Packages');
    if (fs.existsSync(wingetBase)) {
      const entries = fs.readdirSync(wingetBase).filter(d => d.startsWith('Gyan.FFmpeg'));
      for (const entry of entries) {
        const bin = path.join(wingetBase, entry);
        const builds = fs.readdirSync(bin).filter(d => d.startsWith('ffmpeg'));
        for (const build of builds) {
          const exe = path.join(bin, build, 'bin', 'ffmpeg.exe');
          if (fs.existsSync(exe)) return `"${exe}"`;
        }
      }
    }
  }

  return null;
}

// ─── READ METADATA ────────────────────────────────────────────────────────────
const timestampsFile = path.join(VIDEO_DIR, 'timestamps.json');
const metaFile       = path.join(VIDEO_DIR, 'recording_meta.json');

if (!fs.existsSync(timestampsFile) || !fs.existsSync(metaFile)) {
  console.error('\n  [ERROR] Run showcase.js first to generate timestamps.json and recording_meta.json\n');
  process.exit(1);
}

const timestamps = JSON.parse(fs.readFileSync(timestampsFile, 'utf8'));
const { videoPath } = JSON.parse(fs.readFileSync(metaFile, 'utf8'));

if (!fs.existsSync(videoPath)) {
  console.error(`\n  [ERROR] Raw video not found: ${videoPath}\n`);
  process.exit(1);
}

// ─── SEGMENT DEFINITIONS ──────────────────────────────────────────────────────
const segments = [
  {
    name:  '01_landing_page',
    label: '1. Landing Page',
    start: timestamps['01_start'],
    end:   timestamps['01_end'],
  },
  {
    name:  '02_community',
    label: '2. Community',
    start: timestamps['02_start'],
    end:   timestamps['02_end'],
  },
  {
    name:  '03_edit_profile',
    label: '3. Edit Profile',
    start: timestamps['03_start'],
    end:   timestamps['03_end'],
  },
  {
    name:  '04_artist_bio_and_song',
    label: '4. Artist Bio & Song',
    start: timestamps['04_start'],
    end:   timestamps['04_end'],
  },
  {
    name:  '05_concert_and_chat',
    label: '5. Concert Events + Chat Room',
    start: timestamps['05_start'],
    end:   timestamps['06_end'],
  },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function toTimecode(seconds) {
  const m   = Math.floor(seconds / 60);
  const s   = Math.floor(seconds % 60);
  const ms  = Math.round((seconds % 1) * 1000);
  return `${m}:${String(s).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
console.log('\n══════════════════════════════════════════');
console.log('  4B1K VIDEO SHOWCASE — FFmpeg Split');
console.log('══════════════════════════════════════════');

const ffmpeg = findFFmpeg();
if (!ffmpeg) {
  console.error('\n  [ERROR] FFmpeg not found.');
  console.error('  Install it with:  winget install --id Gyan.FFmpeg\n');
  process.exit(1);
}
console.log(`\n  FFmpeg : ${ffmpeg}`);
console.log(`  Source : ${videoPath}`);
console.log(`  Output : ${VIDEO_DIR}\n`);
console.log('──────────────────────────────────────────');

let successCount = 0;

for (const seg of segments) {
  const outputPath = path.join(VIDEO_DIR, `${seg.name}.mp4`);
  const duration   = (seg.end - seg.start).toFixed(1);

  console.log(`\n  ▶  ${seg.label}`);
  console.log(`     ${toTimecode(seg.start)} → ${toTimecode(seg.end)}  (${duration}s)`);
  console.log(`     → ${seg.name}.mp4`);

  const cmd = [
    ffmpeg,
    `-ss ${seg.start}`,
    `-to ${seg.end}`,
    `-i "${videoPath}"`,
    '-c:v libx264',
    '-preset slow',
    '-crf 18',
    '-c:a aac',
    '-b:a 128k',
    '-movflags +faststart',
    '-y',
    `"${outputPath}"`,
  ].join(' ');

  try {
    execSync(cmd, { stdio: 'inherit' });
    const sizeKB = Math.round(fs.statSync(outputPath).size / 1024);
    console.log(`     ✓ Saved  (${sizeKB > 1024 ? (sizeKB / 1024).toFixed(1) + ' MB' : sizeKB + ' KB'})`);
    successCount++;
  } catch (err) {
    console.error(`     ✗ FAILED — ${err.message}`);
  }
}

console.log('\n══════════════════════════════════════════');
console.log(`  Done: ${successCount}/${segments.length} MP4s created`);
console.log('══════════════════════════════════════════');

if (successCount === segments.length) {
  console.log('\n  Your presentation videos are ready in ./videos/\n');
  segments.forEach((s) =>
    console.log(`    ${s.name}.mp4`)
  );

  // Open the first video in the default media player
  const firstVideo = path.join(VIDEO_DIR, `${segments[0].name}.mp4`);
  console.log('\n  Opening first video…');
  try {
    execSync(`start "" "${firstVideo}"`, { stdio: 'ignore', shell: true });
  } catch { /* ignore if default player not set */ }
}
console.log();
