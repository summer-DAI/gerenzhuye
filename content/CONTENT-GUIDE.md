# 内容配置指南

改首页和「问我」里**具体展示什么**，只需编辑本目录下的文件，**不用改代码**。保存后本地刷新；上线需把修改提交并推送到 Git。

更完整的项目说明见仓库根目录 [README.md](../README.md)。

---

## 页面上每一块对应改哪里

| 你在网站上看到的区域 | 修改文件 | 要动的字段（具体信息） |
|----------------------|----------|-------------------------|
| 顶栏左侧标题 | `profile.json` | `brandLabel`（可选）；不填则用 `name` 组合默认文案 |
| Hero：问候语、姓名、小字头衔、大标题、深色标签条、正文段落 | `profile.json` | `greeting`、`name`、`title`、`tagline`、`badge`、`bio` |
| Hero 右侧照片 | `profile.json` | `heroImage`（完整图片 URL，需已在 [next.config.ts](../next.config.ts) 里配置对应图片域名） |
| Hero 按钮（经历 / 三类作品） | — | 「经历」锚到首页 `#experience`；「vibe / 建筑 / 项目经历」进入对应二级页 `/projects/...` |
| 首页联系方式（手机/邮箱/GitHub/小红书） | `profile.json` | `phone`、`email`、`showEmail`、`links`、`xiaohongshu`、`xiaohongshuUrl` |
| 「经历」时间轴（教育/实习 Tab） | `experience.json` | `items` 数组里每一条（见下表） |
| 「作品」卡片（Vibe / 建筑 / 项目经历 三区块） | `projects.json` | `vibeCoding`、`architecture`、`projectExperience` 三个数组；**展示顺序**为：项目经历 → Vibe → 建筑。`projectExperience` 为空时首页不显示该区块与 Hero「项目经历」按钮 |
| 建筑单项详情页 | `content/architecture/{slug}.md` | 与 `projects.json` 里 `architecture[].slug` 对应；六个建筑项目另有独立路由 `/projects/architecture/{slug}` |
| 「问我」里 AI 能引用的文字 | `knowledge.md` | 任意 Markdown |

---

## `profile.json` 字段说明

| 字段 | 必填 | 说明 |
|------|------|------|
| `name` | 是 | 姓名 |
| `title` | 是 | 头衔（Hero 里较小字号一行） |
| `tagline` | 是 | 一句话主标题（Hero 最大字号） |
| `bio` | 是 | 长简介（Hero + 关于区共用） |
| `showEmail` | 是 | 是否展示邮箱，`true` / `false` |
| `email` | 否 | 邮箱地址 |
| `phone` | 否 | 手机，关于区可点击拨号 |
| `xiaohongshu` | 否 | 小红书账号（不含 @ 也可） |
| `xiaohongshuUrl` | 否 | 小红书主页链接（可选） |
| `greeting` | 否 | 问候前缀，默认类似「你好，我是」 |
| `badge` | 否 | Hero 里深色条里的短句 |
| `heroImage` | 否 | 右侧肖像图 URL。可用 `public/照片.jpg` 时写 `"/照片.jpg"`；外链需为 `https`，且域名已在 `next.config.ts` 的 `images.remotePatterns` 中配置。当前示例为占位图，请换成你自己的照片链接或本地文件。 |
| `brandLabel` | 否 | 顶栏站点名 |
| `links` | 是 | 外链数组，每项 `{ "label": "显示名", "href": "https://..." }`，可为 `[]` |

---

## `experience.json` 结构

根对象只有一个键：`items`（数组）。每一项是一条卡片。

| 字段 | 必填 | 说明 |
|------|------|------|
| `kind` | 是 | `education` 教育、`internship` 实习、`campus` 校园 |
| `dateRange` | 是 | 展示用时间，如 `2024.06 – 2024.08` |
| `organization` | 是 | 学校 / 公司 / 组织名称 |
| `role` | 是 | 职位、专业、职务一行 |
| `bullets` | 是 | 要点列表，字符串数组 |
| `logo` | 否 | 左上角小图 URL |
| `href` | 否 | 「查看更多」链接 |

**注意：** JSON 里最后一个字段后面不要多写逗号；每条之间用逗号分隔。

---

## `projects.json` 结构

根对象是三组数组：`vibeCoding`、`architecture`、`projectExperience`（结构与单条作品基本相同）。汇总页分别为 `/projects/vibe`、`/projects/architecture`、`/projects/project-experience`。

**建筑类**每条可增加 `slug`（英文短横线命名），并令 `href` 为 `/projects/architecture/{slug}`，则自动生成详情页；正文写在 `content/architecture/{slug}.md`。本地封面可放 `public/architecture/{slug}/cover.jpg`，`image` 填 `"/architecture/{slug}/cover.jpg"`。仓库根目录的 `architecture-projects/` 说明见该文件夹内 README。

```json
{
  "vibeCoding": [ /* Project[] */ ],
  "architecture": [ /* Project[]，建筑项可有 slug + 站内 href */ ],
  "projectExperience": [ /* Project[] */ ]
}
```

每个数组里的每一项（Project）字段如下：

| 字段 | 必填 | 说明 |
|------|------|------|
| `title` | 是 | 作品标题 |
| `description` | 是 | 简短描述 |
| `href` | 是 | 外链以 `https://` 开头；站内建筑详情以 `/` 开头，如 `/projects/architecture/xxx` |
| `tags` | 是 | 标签字符串数组，没有则写 `[]` |
| `image` | 否 | 封面图 URL |
| `slug` | 否 | 仅建筑详情用，与 `content/architecture/{slug}.md` 一致 |

---

## 可复制模板

### 在 `experience.json` 的 `items` 里加一条经历

把下面复制到 `items` 数组中，注意和前一条之间加英文逗号 `,`：

```json
{
  "kind": "internship",
  "dateRange": "2024.06 – 2024.08",
  "organization": "公司名称",
  "role": "职位名称",
  "bullets": [
    "第一条要点",
    "第二条要点"
  ],
  "href": "https://example.com"
}
```

教育经历把 `kind` 改成 `"education"`，校园经历改成 `"campus"`。不需要「查看更多」时删掉 `href` 行（同时删掉上一行末尾逗号，保持合法 JSON）。

### 在 `projects.json` 的 `projects` 里加一条作品

```json
{
  "title": "作品标题",
  "description": "一两句话说明这个作品做什么。",
  "href": "https://example.com",
  "tags": ["标签1", "标签2"],
  "image": "https://example.com/cover.jpg"
}
```

不需要封面时删除 `image` 整行及上一行末尾逗号。

---

## 常见问题

1. **改完网页没变化**  
   确认已保存文件；本地需正在运行 `npm run dev` 并刷新浏览器。

2. **整页报错 / 白屏**  
   多为 JSON 语法错误（引号、逗号）。可用编辑器 JSON 格式化或校验。

3. **图片不显示**  
   外链图片域名需在 `next.config.ts` 的 `images.remotePatterns` 中允许（示例已含 `images.unsplash.com`）。

4. **线上不更新**  
   修改需 `git add` → `commit` → `push`，等待托管平台重新构建完成。
