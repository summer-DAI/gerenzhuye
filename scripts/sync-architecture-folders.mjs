/**
 * 从「建筑项目/<中文文件夹>」复制到 public/architecture/<slug>，
 * 并生成 content/architecture/<slug>.md（含 PDF 链接）。
 * 由 package.json script 或手动 node scripts/sync-architecture-folders.mjs 调用。
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const srcRoot = path.join(root, "建筑项目");
const publicRoot = path.join(root, "public", "architecture");
const contentRoot = path.join(root, "content", "architecture");

/** 文件夹名 -> slug（URL 安全） */
const FOLDER_TO_SLUG = {
  二砂1956时尚创意园: "ersha-1956-chuangyiyuan",
  城市卡子: "chengshi-kazi",
  常州南站: "changzhou-nanzhan",
  榆林南站: "yulin-nanzhan",
  灵境书店: "lingjing-shudian",
  金昌南站: "jinchang-nanzhan",
};

const DESCRIPTIONS = {
  "ersha-1956-chuangyiyuan": "工业遗存与时尚创意园区相关设计。",
  "chengshi-kazi": "城市节点与公共空间设计。",
  "changzhou-nanzhan": "铁路站房与枢纽设计。",
  "yulin-nanzhan": "铁路站房与枢纽设计。",
  "lingjing-shudian": "文化建筑与阅读空间设计。",
  "jinchang-nanzhan": "站房建筑设计（含方案与图纸）。",
};

const TAGS = {
  "ersha-1956-chuangyiyuan": ["更新", "园区"],
  "chengshi-kazi": ["城市", "公共空间"],
  "changzhou-nanzhan": ["交通建筑", "站房"],
  "yulin-nanzhan": ["交通建筑", "站房"],
  "lingjing-shudian": ["文化", "书店"],
  "jinchang-nanzhan": ["交通建筑", "站房"],
};

const IMAGE_RE = /\.(jpe?g|png|webp|gif)$/i;

const COVER_FALLBACK = [
  "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1200&q=80",
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80",
  "https://images.unsplash.com/photo-1506905925346-21bfe4e75718?w=1200&q=80",
  "https://images.unsplash.com/photo-1511818966892-d7d671c56e0e?w=1200&q=80",
  "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=1200&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
];

/** 优先用常见封面文件名，否则取排序后的第一张图 */
function pickCoverImage(files) {
  const imgs = files.filter((f) => IMAGE_RE.test(f));
  if (imgs.length === 0) return null;
  const prefer = [
    "cover.jpg",
    "cover.jpeg",
    "cover.png",
    "poster.jpg",
    "poster.png",
    "thumb.jpg",
    "thumb.png",
  ];
  const lower = imgs.map((f) => f.toLowerCase());
  for (const p of prefer) {
    const i = lower.indexOf(p);
    if (i >= 0) return imgs[i];
  }
  return [...imgs].sort((a, b) => a.localeCompare(b, "zh"))[0];
}

function publicImageUrl(slug, fname) {
  return `/architecture/${slug}/${encodeURIComponent(fname)}`;
}

function main() {
  if (!fs.existsSync(srcRoot)) {
    console.error("未找到文件夹:", srcRoot);
    process.exit(1);
  }

  const architecture = [];
  const order = Object.keys(FOLDER_TO_SLUG);
  let coverIdx = 0;

  for (const folderName of order) {
    const slug = FOLDER_TO_SLUG[folderName];
    const srcDir = path.join(srcRoot, folderName);
    if (!fs.existsSync(srcDir)) {
      console.warn("跳过（不存在）:", folderName);
      continue;
    }

    const destDir = path.join(publicRoot, slug);
    fs.mkdirSync(destDir, { recursive: true });
    const srcFiles = fs.readdirSync(srcDir);
    for (const fname of srcFiles) {
      const sp = path.join(srcDir, fname);
      const dp = path.join(destDir, fname);
      if (fs.statSync(sp).isFile()) {
        fs.copyFileSync(sp, dp);
      }
    }

    const allFiles = fs.readdirSync(destDir);
    const pdfs = allFiles.filter((f) => /\.pdf$/i.test(f));
    const coverFile = pickCoverImage(allFiles);
    const coverUrl = coverFile
      ? publicImageUrl(slug, coverFile)
      : COVER_FALLBACK[coverIdx % COVER_FALLBACK.length];

    const lines = [
      "## 项目说明",
      "",
      "页面中的**图片**与下列 **PDF** 为同一套图纸内容：图片便于在线浏览，PDF 便于下载与打印。",
      "",
      "## 图纸与文件（PDF）",
      "",
    ];
    for (const fname of pdfs.sort((a, b) => a.localeCompare(b, "zh"))) {
      const href = `/architecture/${slug}/${encodeURIComponent(fname)}`;
      lines.push(`- [${fname}](${href})`);
    }
    lines.push("");
    fs.writeFileSync(path.join(contentRoot, `${slug}.md`), lines.join("\n"), "utf8");

    architecture.push({
      slug,
      title: folderName,
      description: DESCRIPTIONS[slug] ?? "建筑设计项目。",
      href: `/projects/architecture/${slug}`,
      tags: TAGS[slug] ?? ["建筑"],
      image: coverUrl,
    });
    coverIdx += 1;
  }

  const projectsPath = path.join(root, "content", "projects.json");
  const projects = JSON.parse(fs.readFileSync(projectsPath, "utf8"));
  projects.architecture = architecture;
  fs.writeFileSync(
    projectsPath,
    JSON.stringify(projects, null, 2) + "\n",
    "utf8"
  );

  console.log("已同步", architecture.length, "个建筑项目；已更新 content/projects.json");
}

main();
