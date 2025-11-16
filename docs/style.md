# "Taskduck" (手绘/线框图) 风格指南 V3 - 健康管理主题

---

### 1. 概览 (Overview)

* **设计系统名称：** “蓝图” (Blueprint) / “草稿” (Sketch)
* **核心理念：** “功能性的低保真 (Functional Lo-fi)”。
* **设计原则：**
    * **回归本质：** 界面看起来像一个设计师在纸上的草图或工程师的蓝图。
    * **高对比度：** 几乎所有元素都是纯黑白，辅以高饱和度的功能色。
    * **零精致感：** 故意抛弃圆角、阴影、渐变，拥抱“粗糙”和“锐利”的边缘。
    * **万物皆有框：** 每个单元都必须有一个粗黑的边框。

---

### 2. 视觉风格 (Visual Rules)

#### 2.1 调色板 (Color Palette)
颜色不用于装饰，仅用于传达状态。

| 用途 | 预览色 | 十六进制 (Hex) | Tailwind 类 |
| :--- | :--- | :--- | :--- |
| 背景 (Base) |  | `#FFFFFF` | `bg-white` |
| 描边/文本 (Stroke) |  | `#000000` | `border-black` / `text-black` |
| 主色/选中 (Primary) |  | `#50A7C2` (估算) | `bg-primary` |
| 强调色 (Highlight) |  | `#FBCB2D` (估算) | `bg-highlight` |

#### 2.2 字体规范 (Typography)
* **字体族 (Font Family)：** 推荐 `Virgil` 或 `Knewave` 等“手绘感”无衬线字体。
* **结构性文本 (Structural Text):**
    * **用途：** 导航 (DASHBOARD)、按钮 (记录数据)、标签 (风险等级)。
    * **规则：** **永远全部大写 (ALL CAPS)**。
    * **字重 (Weight)：** `Semibold` (中粗)。
* **数据展示 (Data Display):**
    * **用途：** 统计数字 (例如血糖读数 "5.8", "33%")。
    * **字重 (Weight)：** **最粗字重 (Black / Heavy)**。
* **用户内容 (User Content):**
    * **用途：** 输入框中的内容 (例如：5.8)、备注。
    * **规则：** 正常大小写。
    * **字重 (Weight)：** `Regular` (常规)。

#### 2.3 间距系统 (Spacing System)
使用基于 4px / 8px 的网格，但整体偏向“宽敞”。
* `p-4` / `gap-4` (16px): 组件内边距或元素间距。
* `p-6` / `gap-6` (24px): 卡片 (Card) 的标准内边距。

#### 2.4 组件样式 (Component Styles)
* **核心规则：** 边框 `border-2` (2px 粗细) 且 `border-black`。
* **按钮 (Buttons):**
    * **默认/次要：** `bg-white` `border-2` `border-black` `text-black` `uppercase`。
    * **主要/选中：** `bg-primary` (蓝色) `border-2` `border-black` `text-black` `uppercase`。
* **输入框 (Inputs):** `bg-white` `border-2` `border-black`。

#### 2.5 阴影与层级 (Shadows & Elevation)
* **规则：** **零阴影 (No Shadows)**。
* **层级 (Elevation)：** 页面完全“扁平”。层级关系通过“边框”和“布局”来物理分隔。

#### 2.6 动画与过渡 (Animations & Transitions)
* **规则：** 避免平滑，追求“快”和“生硬” (`duration-75`)。
* **交互：** 添加 `hover` 和 `outline` 交互。
    * `hover:bg-gray-100` (用于默认按钮)。
    * `active:translate-y-[1px]` (模拟“按下”的物理感)。

#### 2.7 边框圆角 (Border Radius)
* **规则：** **零圆角 (Zero Radius)**。
* **Tailwind 类：** `rounded-none`。所有元素都是 90 度直角。

---

### 3. 代码实现规范 (Implementation Rules)

这是为*实现*上述视觉风格而定制的编码规则。

* **1. 基础结构 (Base Structure):**
    * 始终包含 `<html>`, `<head>`, `<body>` 标签。
    * 所有 Tailwind 类应放在 `<body>` 标签中，而不是 `<html>`。

* **2. 编码 (Coding):**
    * 只在单个代码块中使用 HTML/Tailwind。
    * 避免设置 `tailwind.config.js` 或全局 CSS 类；所有样式尽可能通过 Tailwind 类在 HTML 标签中直接实现。
    * 任何必需的自定义 CSS 都应通过 `style` 属性以内联方式添加。

* **3. 组件与资源 (Components & Assets):**
    * **图标 (Icons):** 使用 Lucide 图标，并始终设置 `stroke-width="1.5"`。
    * **图表 (Charts):** 如需图表 (例如血糖趋势图)，使用 Chart.js。
    * **图像 (Images):** 如需占位图，使用 Unsplash 的 `faces`, `3d`, `render` 等主题。
    * **Logo:** 如需 Logo，使用字母并设置紧密的字间距 (tight tracking)。

* **4. 交互与布局 (Interaction & Layout):**
    * **响应式 (Responsive):** 必须实现响应式布局。
    * **动画 (Animations):** 使用 Tailwind 的过渡和动画，不使用 JS。添加 `hover` 和 `outline` 交互。
    * **风格模式 (Mode):** 默认使用**亮色模式 (Light Mode)**，这符合 "Taskduck" 的原始设计。
    * **按钮 (Buttons):** 避免使用右下角浮动的下载按钮。
    * **创意 (Creativity):** 在遵循上述规则的前提下，在布局、字体和功能实现上保持创意和细致。