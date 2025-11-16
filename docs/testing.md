# 测试用例文档

本项目当前未引入测试框架。以下提供推荐栈与样例，便于快速落地单元测试、组件测试与端到端测试。

## 推荐工具

- 单元与组件测试：`vitest`、`@testing-library/react`、`@testing-library/jest-dom`、`jsdom`
- 端到端测试：`@playwright/test`

## 安装命令

```bash
npm i -D vitest @testing-library/react @testing-library/user-event jsdom @testing-library/jest-dom
npm i -D @playwright/test
```

## Vite 测试配置（参考）

在 `vite.config.ts` 中加入：
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: { reporter: ['text', 'html'] }
  }
})
```

新增 `tests/setup.ts`：
```ts
import '@testing-library/jest-dom'
```

## 目录建议

- `tests/unit/*`：服务与工具函数测试
- `tests/components/*`：React 组件测试
- `tests/e2e/*`：端到端测试（Playwright）

## 服务层示例测试

文件：`tests/unit/healthDataService.test.ts`
```ts
import { describe, it, expect, beforeEach } from 'vitest'
import { healthDataService } from '../../src/services/healthDataService'

function mockStorage() {
  let store: Record<string, string> = {}
  // 简易 mock，满足读写调用
  // @ts-ignore
  global.localStorage = {
    getItem: (k: string) => store[k] ?? null,
    setItem: (k: string, v: string) => { store[k] = v },
    removeItem: (k: string) => { delete store[k] }
  }
}

describe('healthDataService', () => {
  beforeEach(() => { mockStorage(); healthDataService.clearAllData() })

  it('保存并读取记录', () => {
    const id = healthDataService.generateId()
    healthDataService.saveRecord({ id, type: 'weight', value: 70, timestamp: Date.now() })
    const all = healthDataService.getAllRecords()
    expect(all.length).toBe(1)
    expect(all[0].type).toBe('weight')
  })

  it('按类型筛选', () => {
    const now = Date.now()
    healthDataService.saveMultipleRecords([
      { id: 'a', type: 'weight', value: 70, timestamp: now },
      { id: 'b', type: 'exercise', typeDetail: '跑步', duration: 30, timestamp: now }
    ] as any)
    const weights = healthDataService.getRecordsByType('weight')
    expect(weights.length).toBe(1)
  })
})
```

## 语音识别示例测试

文件：`tests/unit/voiceRecognitionService.test.ts`
```ts
import { describe, it, expect } from 'vitest'
import { voiceRecognitionService } from '../../src/services/voiceRecognitionService'

describe('voiceRecognitionService', () => {
  it('解析体重与血压', async () => {
    const text = '体重 75kg，血压高压120低压80'
    const result = await voiceRecognitionService.recognizeHealthData(text)
    expect(result.weight?.value).toBe(75)
    expect(result.bloodPressure?.systolic).toBe(120)
    expect(result.bloodPressure?.diastolic).toBe(80)
  })
})
```

## 组件示例测试

文件：`tests/components/HistoryRecords.test.tsx`
```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HistoryRecords } from '../../src/components/HistoryRecords'

it('渲染空状态', () => {
  render(<HistoryRecords records={[]} onRecordsUpdate={() => {}} />)
  expect(screen.getByText(/暂无记录/)).toBeTruthy()
})
```

## 端到端测试示例（Playwright）

文件：`tests/e2e/home.spec.ts`
```ts
import { test, expect } from '@playwright/test'

test('首页加载成功并显示今日概览', async ({ page }) => {
  await page.goto('http://localhost:5173/')
  await expect(page.getByText('今日概览')).toBeVisible()
})
```

运行命令：
```bash
npm run dev
npx playwright test
```

## 覆盖建议

- 服务层：存取、筛选、更新与删除
- 语音解析：各类型数据的边界值与错误输入
- 组件：渲染、交互与边界状态
- e2e：核心用户路径（录入→确认→列表可见）

## 持续集成

- 在 CI 中执行 `npm run build` 与 `vitest --coverage`
- 对 e2e 测试使用独立作业，提前启动预览服务