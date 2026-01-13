# 个人主页 | Academic Portfolio

一个现代化、精美的学术个人主页模板，专为研究人员设计。

## ✨ 特性

- 🎨 **深海主题设计** - 优雅的深色主题，带有渐变装饰
- 📱 **完全响应式** - 在所有设备上完美展示
- ⚡ **Vite 驱动** - 快速的开发体验和优化的构建
- 🚀 **GitHub Pages 就绪** - 一键部署到 GitHub Pages

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 本地开发

```bash
npm run dev
```

访问 http://localhost:5173 预览网站

### 3. 构建生产版本

```bash
npm run build
```

构建产物在 `dist/` 目录

### 4. 预览生产版本

```bash
npm run preview
```

## 📝 自定义内容

### 修改个人信息

编辑 `index.html`，替换以下内容：

1. **姓名和头衔**
   - 搜索 `Your Name` 并替换为你的姓名
   - 修改 `PhD Candidate @ HKU` 为你的职位

2. **个人简介**
   - 修改 `.hero-bio` 中的描述文字

3. **头像**
   - 将你的头像放到项目根目录，命名为 `avatar.jpg`
   - 在 `index.html` 中取消注释图片标签并删除占位符

4. **联系方式**
   - 替换邮箱地址
   - 更新 GitHub、Twitter、LinkedIn 等链接

5. **研究兴趣**
   - 修改 `.research-card` 中的内容

6. **论文发表**
   - 更新 `.pub-item` 中的论文信息

7. **开源项目**
   - 修改 `.project-card` 中的项目信息

### 修改主题颜色

编辑 `style.css` 中的 CSS 变量：

```css
:root {
  --accent-primary: #5ce1e6;    /* 主色调 */
  --accent-secondary: #7b68ee;  /* 次要色调 */
  /* ... */
}
```

## 🌐 部署到 GitHub Pages

### 方法一：手动部署

1. 运行 `npm run build`
2. 将 `dist/` 目录的内容推送到 `gh-pages` 分支

### 方法二：GitHub Actions 自动部署

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - name: Install and Build
        run: |
          npm install
          npm run build
          
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### 注意事项

如果你的仓库名不是 `username.github.io`，需要修改 `vite.config.js`：

```js
export default defineConfig({
  base: '/your-repo-name/',  // 替换为你的仓库名
})
```

## 📁 项目结构

```
bio/
├── index.html      # 主页面
├── style.css       # 样式文件
├── main.js         # 交互脚本
├── vite.config.js  # Vite 配置
├── package.json    # 项目配置
├── .gitignore      # Git 忽略文件
└── README.md       # 说明文档
```

## 📄 License

MIT License - 自由使用和修改！

---

Made with ❤️ for researchers

