# 本地开发与规范

## 环境准备

- Node.js 18+
- 包管理器：`npm`（仓库包含 `package-lock.json`）

## 安装与启动

```bash
npm install
npm run dev
```

- 预览构建：
```bash
npm run build
npm run preview
```

- 代码检查：
```bash
npm run lint
npm run check
```

## 代码规范

- TypeScript 强类型，避免使用 `any`
- 组件采用函数式与 Hooks，尽量保持无副作用
- 样式优先使用 Tailwind 原子类，必要时抽取复用组件
- 文件命名：组件 `PascalCase.tsx`，工具与服务 `camelCase.ts`
- 导入路径遵循 `vite-tsconfig-paths`，避免长相对路径

## 目录约定

- `src/components`：通用与页面组件
- `src/pages`：路由页面
- `src/services`：业务服务（本地存储、语音识别）
- `src/hooks`：自定义 Hook
- `src/types`：类型定义
- `src/lib`：工具方法

## 提交与分支

- 提交信息简洁明确，建议格式：`feat: …`、`fix: …`、`docs: …`
- 功能开发使用特性分支，合并前确保通过 `lint` 与 `build`

## 测试建议

- 为服务层与复杂组件补充单元测试
- 针对录入与列表交互覆盖关键路径

## 常见问题

- 本地数据存储在 `localStorage`，清空可调用服务的 `clearAllData()` 或浏览器 DevTools 清理
- 语音识别为模拟逻辑，需要接入真实 API 时替换服务实现