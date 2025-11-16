# 部署指南（Vercel）

本项目适合部署到 Vercel，构建产物目录为 `dist`。

## 步骤

1. 登录 Vercel 并新建项目，选择 Git 仓库 `solo`
2. 框架预设选择 `Vite`
3. 构建命令：`npm run build`
4. 输出目录：`dist`
5. （可选）环境变量在 Vercel 项目设置中添加
6. 保存配置后触发首轮构建与部署

## 本地预览

```bash
npm run build
npm run preview
```

## 常见问题

- 构建失败请检查 Node 版本与依赖锁文件（使用 npm）
- 若需要自定义路由回退，可在 `vite.config.ts` 或部署平台配置 SPA 回退到 `index.html`