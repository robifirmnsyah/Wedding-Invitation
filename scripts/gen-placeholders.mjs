import { promises as fs } from "fs";
import path from "path";

const root = process.cwd();
const base = path.join(root, "public", "assets");

const palette = [
  ["#dce4d3", "#708238"],
  ["#e9e1d3", "#566529"],
  ["#f5f0e6", "#8a9a52"],
  ["#cdd9c0", "#647a3c"],
];

function photoSvg(label, w, h, i) {
  const [bg, fg] = palette[i % palette.length];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${bg}"/>
      <stop offset="100%" stop-color="${fg}" stop-opacity="0.55"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  <circle cx="${w * 0.5}" cy="${h * 0.38}" r="${Math.min(w, h) * 0.12}" fill="#faf8f3" opacity="0.7"/>
  <path d="M0 ${h * 0.72} Q ${w * 0.25} ${h * 0.6} ${w * 0.5} ${h * 0.72} T ${w} ${h * 0.7} V ${h} H 0 Z" fill="${fg}" opacity="0.45"/>
  <text x="50%" y="52%" font-family="Georgia, serif" font-size="${Math.round(Math.min(w, h) * 0.09)}" fill="#3b3b3b" text-anchor="middle" opacity="0.75">${label}</text>
  <text x="50%" y="62%" font-family="Arial, sans-serif" font-size="${Math.round(Math.min(w, h) * 0.05)}" fill="#3b3b3b" text-anchor="middle" opacity="0.5">ganti dengan foto Anda</text>
</svg>`;
}

function qrisSvg() {
  let cells = "";
  // deterministic faux-QR pattern
  const n = 21;
  const s = 12;
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const on = (x * 7 + y * 13 + x * y) % 3 === 0;
      const finder =
        (x < 7 && y < 7) || (x >= n - 7 && y < 7) || (x < 7 && y >= n - 7);
      if (on || finder) {
        cells += `<rect x="${x * s}" y="${y * s}" width="${s}" height="${s}" fill="#3b3b3b"/>`;
      }
    }
  }
  const dim = n * s;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${dim}" height="${dim}" viewBox="0 0 ${dim} ${dim}">
  <rect width="${dim}" height="${dim}" fill="#faf8f3"/>${cells}
  <rect x="0" y="0" width="${dim}" height="${dim}" fill="none" stroke="#708238" stroke-width="4"/>
</svg>`;
}

const tasks = [];

// gallery 1..8
const captions = [
  "Under The Blue",
  "Our Little Heart",
  "Moments",
  "Walking With You",
  "Grass Fields",
  "Golden Hour",
  "Candid",
  "Forever Begins",
];
for (let i = 0; i < 8; i++) {
  tasks.push([
    path.join(base, "gallery", `gallery-${i + 1}.svg`),
    photoSvg(captions[i], 800, 800, i),
  ]);
}

// story 1..4
const storyLabels = ["First Met", "In Relationship", "Engagement", "Toward Marriage"];
for (let i = 0; i < 4; i++) {
  tasks.push([
    path.join(base, "story", `story-${i + 1}.svg`),
    photoSvg(storyLabels[i], 800, 600, i),
  ]);
}

// couple
tasks.push([path.join(base, "bride-groom", "groom.svg"), photoSvg("Groom", 600, 600, 1)]);
tasks.push([path.join(base, "bride-groom", "bride.svg"), photoSvg("Bride", 600, 600, 3)]);

// qris
tasks.push([path.join(base, "gift", "qris.svg"), qrisSvg()]);

for (const [file, content] of tasks) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, content, "utf-8");
}

// silent placeholder mp3 (tiny valid MPEG frame, near-silent)
const silentMp3Base64 =
  "SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQxAADB8AhSmxhIIEVCSiJrDCQBTcu3UrAIwUdkRgQbFAZC1CQEwTJ9mjRvBA4UOLD8nKVOWfh+UlK3z/177OXrfOdKl7pyn3Xf//WreyTEFNRTMuOTkuNVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV";
await fs.mkdir(path.join(base, "music"), { recursive: true });
await fs.writeFile(
  path.join(base, "music", "violin-wedding.mp3"),
  Buffer.from(silentMp3Base64, "base64")
);

console.log(`Generated ${tasks.length} placeholder images + 1 music placeholder.`);
