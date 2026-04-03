# 个人主页 + 可配置知识库问答

基于 [Next.js](https://nextjs.org/)（App Router）的个人主页：展示简介、**教育/实习经历**、作品；访客可在「问我」页面向大模型提问，回答仅依据 `content/knowledge.md` 与简介（服务端注入提示词，**不会**在浏览器暴露 API Key）。

内容通过仓库 **`content/`** 目录下的 JSON / Markdown 维护，推送部署即可更新。  
**各模块对应改哪些字段**：见 [content/CONTENT-GUIDE.md](content/CONTENT-GUIDE.md)。

## 本地开发

1. 安装依赖：

```bash
npm install
```

2. 复制环境变量并填写 API Key（使用「问我」时需要）：

```bash
copy .env.example .env.local
```

编辑 `.env.local`，设置 `OPENAI_API_KEY`。可选：`OPENAI_BASE_URL`、`OPENAI_MODEL`。

3. 启动开发服务器：

```bash
npm run dev
```

在浏览器打开 [http://localhost:3000](http://localhost:3000)。

## 配置内容

| 文件 | 作用 |
|------|------|
| `content/profile.json` | 姓名、头衔、简介、手机、邮箱、链接、小红书；可选 `greeting`、`badge`、`heroImage`、`brandLabel`（顶栏站点名） |
| `content/experience.json` | 经历卡片：`kind` 为 `education`（教育）或 `internship`（实习）；含时间、机构、职位、要点，可选 `logo`、`href` |
| `content/projects.json` | 作品列表（`vibeCoding` 与 `architecture` 两组） |
| `content/knowledge.md` | 供「问我」使用的知识库（Markdown） |

修改后保存即可在本地看到效果；部署到 Vercel 后推送仓库以触发重新构建。

## 部署到 Vercel

1. 将仓库推送到 GitHub / GitLab。
2. 在 [Vercel](https://vercel.com/) 导入该仓库，框架预设为 Next.js。
3. 在 **Settings → Environment Variables** 中添加 **`OPENAI_API_KEY`**（若使用「问我」）；按需添加 **`OPENAI_BASE_URL`**、**`OPENAI_MODEL`**。
4. 每次更新 `content/*` 并推送即可重新部署。

## 脚本

- `npm run dev` — 本地开发
- `npm run build` — 生产构建
- `npm run start` — 启动生产服务器（需先 `build`）
- `npm run lint` — 运行 ESLint

## 说明

- 问答接口为 `POST /api/chat`，请求体为 `{ "messages": [ { "role": "user" \| "assistant", "content": "..." } ] }`，响应为 **流式纯文本**（`text/plain`）。
- 单条消息长度与条数在服务端有限制，防止滥用。
