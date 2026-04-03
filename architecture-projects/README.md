# 建筑项目素材

请将六个项目的子文件夹放在仓库根目录的 **`建筑项目/`** 下（与当前结构一致）。

更新网站配置与 `public/architecture/` 静态文件时，在项目根目录执行：

```bash
npm run sync:architecture
```

脚本会：

1. 按 `scripts/sync-architecture-folders.mjs` 中的**文件夹名 → slug** 映射，复制到 `public/architecture/<slug>/`；
2. 生成 `content/architecture/<slug>.md`（列出该文件夹内所有 PDF 链接）；
3. 覆盖写入 `content/projects.json` 中的 **`architecture`** 数组（标题使用文件夹名）。

修改映射或说明文案时，编辑 **`scripts/sync-architecture-folders.mjs`** 后再次运行上述命令。

同步脚本会自动识别 **PNG / JPG / WebP / GIF**，优先使用名为 `cover.jpg`、`cover.png`、`poster.jpg` 等的文件作为**列表封面**；否则用文件名排序后的**第一张图**。首页卡片与详情页均使用这些图片；详情页会展示该文件夹内**全部图片**的画廊，PDF 链接仍在文末 Markdown 区域。
