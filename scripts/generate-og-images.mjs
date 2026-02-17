import { readdir, readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { join, basename } from "path";
import sharp from "sharp";

const BLOG_DIR = join(import.meta.dirname, "..", "blog");
const OUT_DIR = join(import.meta.dirname, "..", "static", "img", "og");
const MONAD_SVG_PATH = join(
  import.meta.dirname,
  "..",
  "static",
  "svg",
  "monad.svg",
);

const WIDTH = 1200;
const HEIGHT = 630;
const BG = "#1b1b1d";
const PINK = "#f75394";

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const fm = {};
  for (const line of match[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx > 0) {
      fm[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
    }
  }
  return fm;
}

function escapeXml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function wrapTitle(title, maxChars = 30) {
  const words = title.split(" ");
  const lines = [];
  let current = "";
  for (const word of words) {
    if (current && (current + " " + word).length > maxChars) {
      lines.push(current);
      current = word;
    } else {
      current = current ? current + " " + word : word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function buildSvg(title, monadSvgContent) {
  const monadInner = monadSvgContent
    .replace(/<svg[^>]*>/, "")
    .replace(/<\/svg>/, "");

  const lines = wrapTitle(title);
  const fontSize = lines.length > 2 ? 38 : 46;
  const lineHeight = fontSize * 1.3;
  const textBlockHeight = lines.length * lineHeight;

  const monadSize = 150;
  const gap = 24;
  const totalHeight = monadSize + gap + textBlockHeight + 30;
  const startY = (HEIGHT - totalHeight) / 2;
  const monadY = startY;
  const textStartY = monadY + monadSize + gap + fontSize;
  const domainY = textStartY + (lines.length - 1) * lineHeight + 50;

  const textLines = lines
    .map(
      (line, i) =>
        `<text x="${WIDTH / 2}" y="${textStartY + i * lineHeight}" text-anchor="middle" font-family="system-ui, -apple-system, 'Segoe UI', sans-serif" font-size="${fontSize}" font-weight="700" fill="#ffffff">${escapeXml(line)}</text>`,
    )
    .join("\n    ");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${BG}"/>
  <radialGradient id="glow" cx="${WIDTH / 2}" cy="${monadY + monadSize / 2}" r="300" gradientUnits="userSpaceOnUse">
    <stop offset="0%" stop-color="${PINK}" stop-opacity="0.12"/>
    <stop offset="100%" stop-color="${BG}" stop-opacity="0"/>
  </radialGradient>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow)"/>
  <g transform="translate(${(WIDTH - monadSize) / 2}, ${monadY}) scale(${monadSize / 36})">
    ${monadInner}
  </g>
  ${textLines}
  <text x="${WIDTH / 2}" y="${domainY}" text-anchor="middle" font-family="system-ui, -apple-system, 'Segoe UI', sans-serif" font-size="20" font-weight="400" fill="#888888">payjoin.org</text>
</svg>`;
}

async function main() {
  const monadSvg = await readFile(MONAD_SVG_PATH, "utf-8");

  if (!existsSync(OUT_DIR)) {
    await mkdir(OUT_DIR, { recursive: true });
  }

  const files = (await readdir(BLOG_DIR)).filter((f) => f.endsWith(".md"));
  let generated = 0;
  let skipped = 0;
  let frontmatterUpdated = 0;

  for (const file of files) {
    const slug = basename(file, ".md");
    const outPath = join(OUT_DIR, `${slug}.png`);
    const ogUrl = `/img/og/${slug}.png`;
    const filePath = join(BLOG_DIR, file);
    const content = await readFile(filePath, "utf-8");
    const fm = parseFrontmatter(content);
    if (!fm?.title) continue;

    // Generate PNG if it doesn't exist
    if (existsSync(outPath)) {
      skipped++;
    } else {
      const title = fm.title.replace(/^["']|["']$/g, "");
      const svg = buildSvg(title, monadSvg);
      await sharp(Buffer.from(svg)).resize(WIDTH, HEIGHT).png().toFile(outPath);
      console.log(`  generated: ${slug}.png`);
      generated++;
    }

    // Inject image frontmatter if missing
    if (!fm.image) {
      const updated = content.replace(/^(---\n)/, `$1image: ${ogUrl}\n`);
      await writeFile(filePath, updated);
      console.log(`  frontmatter: ${file}`);
      frontmatterUpdated++;
    }
  }

  console.log(
    `og-images: ${generated} generated, ${skipped} skipped, ${frontmatterUpdated} frontmatter updated`,
  );
}

main().catch((err) => {
  console.error("og-image generation failed:", err);
  process.exit(1);
});
