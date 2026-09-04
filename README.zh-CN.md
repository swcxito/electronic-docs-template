# 电子电路文档模板

[English](README.md) | 简体中文

基于 **Astro Starlight** 的电子电路文档模板，集成随站点部署的 **CircuitJS** 仿真器和 **WaveDrom** 时序图。

[在线文档](https://swcxito.github.io/electronic-docs-template/) · [原 Sphinx 版本](https://github.com/swcxito/electronic-docs-template/tree/sphinx)

## 分支说明

- **`main`**：从官方 `starlight` 模板在独立目录中新建，再迁入原项目的电路、波形示例和模拟器资源。
- **`sphinx`**：原始 Sphinx 代码，保留在提交 `7c4917f1a892fb3e61fd36127532b5081e527fd8`，该分支的 README 包含原 Python 构建方式。

迁移保留 Git 历史和原有许可证。新实现以官方模板为起点，没有在原工程目录上直接改造。

## 功能

- Markdown/MDX 文档、侧边栏、全文搜索、代码高亮与明暗主题。
- CircuitJS 本地资源、原有全部仿真参数、数据校验及中英文错误提示。
- WaveDrom 在构建时生成 SVG，无需运行时 CDN 或浏览器 JavaScript。
- 适配 GitHub Pages 仓库子路径和嵌套文档中的电路资源。
- 默认使用 pnpm，提供类型检查、单元测试、浏览器测试及自动发布。

## 快速开始

环境要求：**Node.js 24+** 和 **pnpm 11.24.0**（版本固定在 `package.json`）。

点击仓库的 **Use this template** 创建自己的仓库，克隆后执行：

```sh
pnpm install
pnpm dev
```

打开 Astro 输出的本地地址。本仓库默认是 `http://localhost:4321/electronic-docs-template/`。

```sh
pnpm build       # 输出到 dist/
pnpm preview     # 通过 HTTP 预览生产构建
```

## 编写文档

在 `src/content/docs/` 下新增 `.md` 或 `.mdx`，并在 frontmatter 中填写 `title` 和可选的 `description`。在 `astro.config.mjs` 中配置站点信息和侧边栏。

使用组件的页面应采用 MDX。以下导入路径适用于 `src/content/docs/guides/` 下的页面。

### CircuitJS 电路

在 [CircuitJS](https://www.falstad.com/circuit/circuitjs.html) 中创建电路，通过 File 菜单导出链接，提取查询参数 `ctz`。

```mdx
import Circuit from '../../../components/Circuit.astro';
import { circuitExample } from '../../../lib/examples';

<Circuit
  ctz={circuitExample}
  title="示例电路"
  height={600}
  running={true}
  editable={false}
/>
```

将 `circuitExample` 替换为自己的压缩数据字符串。布尔值使用表达式，例如 `running={false}`，不要写成字符串。

| 属性 | 默认值 | 说明 |
| --- | --- | --- |
| `ctz` | 必填 | 导出链接中的压缩电路数据 |
| `title` | Interactive CircuitJS simulation | iframe 无障碍标题 |
| `height` | `640` | 像素数值或 `600px` 等 CSS 长度 |
| `width` | `100%` | 宽度，不超过文档区域 |
| `running` | `true` | 自动开始仿真 |
| `hideMenu` | `true` | 隐藏菜单 |
| `hideSidebar` | `false` | 隐藏仿真器侧栏 |
| `editable` | `false` | 允许编辑电路 |
| `hideInfoBox` | `false` | 隐藏元件信息框 |
| `mouseWheelEdit` | `true` | 允许滚轮修改参数 |
| `lang` | `en` | 错误提示语言，`zh-CN` 使用中文 |

无效数据会显示错误提示，不会创建损坏的仿真 iframe。`public/circuitjs/` 完整保留原模拟器，无需依赖外部仿真服务。

### WaveDrom 时序图

```mdx
import WaveDrom from '../../../components/WaveDrom.astro';

<WaveDrom title="时钟与总线传输" source={{
  signal: [
    { name: 'clk', wave: 'P......' },
    { name: 'bus', wave: 'x.==.=x', data: ['head', 'body', 'tail'] },
    { name: 'wire', wave: '0.1..0.' },
  ],
}} />
```

`source` 支持 WaveJSON 对象和 JSON5 字符串，支持 `signal`、`reg`、`assign`，内置 default、narrow、lowkey 皮肤。每张图生成独立的 SVG 图片，避免同页多图的 ID 和样式冲突。错误数据会使构建失败。语法见 [WaveDrom 教程](https://wavedrom.com/tutorial.html)。

## 插件迁移对应关系

| 原实现 | 新实现 |
| --- | --- |
| Sphinx + Alabaster | Astro + Starlight |
| `myst_parser` | 原生 Markdown/MDX |
| `sphinxcontrib.wavedrom` | `WaveDrom.astro` + `wavedrom` |
| `circuitjs_support` | `Circuit.astro` |
| Python `lzstring` | JavaScript `lz-string` |
| `html_extra_path` | `public/circuitjs/` |

`.rst`、MyST 指令和 Sphinx 角色需要转换为 Markdown/MDX，新版本不直接解释这些语法。电路参数改为驼峰命名，如 `hide-menu` → `hideMenu`、`mousewheel-edit` → `mouseWheelEdit`。完整说明见[迁移指南](src/content/docs/reference/migration.md)。

## 验证

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm validate
```

`validate` 依次运行类型检查、单元测试、生产构建和浏览器测试，覆盖电路数据、全部参数、根路径与仓库子路径、WaveDrom 输出与错误输入、实际仿真、文档链接、搜索、主题和手机导航。Linux 缺少浏览器系统依赖时使用 `pnpm exec playwright install --with-deps chromium`。

## 自动发布

在仓库 **Settings → Pages** 中将 Source 设置为 **GitHub Actions**。推送到 `main` 后，工作流验证并发布 `dist/`；PR 只验证，不发布。

部署时从 GitHub Pages 设置获取站点 URL 和基础路径。其他环境可以配置：

| 环境变量 | 默认值 |
| --- | --- |
| `GITHUB_REPOSITORY` | `swcxito/electronic-docs-template`，用于仓库链接与默认 URL |
| `SITE_URL` | `https://OWNER.github.io` |
| `BASE_PATH` | `/REPOSITORY`，用户主页仓库则为 `/` |

```sh
SITE_URL=https://docs.example.com BASE_PATH=/ pnpm build
```

请通过 HTTP 预览，不要直接用 `file://` 打开构建文件。

## 目录

- `astro.config.mjs`：站点、导航、基础路径。
- `src/content/docs/`：Markdown/MDX 文档。
- `src/components/`：电路和时序图组件。
- `src/lib/`：校验、渲染逻辑和原示例数据。
- `public/circuitjs/`：原 CircuitJS 静态资源。
- `tests/`：单元与浏览器测试。
- `.github/workflows/`：验证和发布流程。

## 许可证

模板继续使用 [GPLv2](LICENSE)，文档继续使用 [MIT](LICENSE.docs)。使用者保留自己编写内容的版权，可另行选择内容许可证。

Astro、Starlight、WaveDrom、ONML、lz-string、JSON5 使用 MIT；CircuitJS1 使用 GPLv2。原字体许可保留在 `public/circuitjs/font/`。组件来源及官方模板版权声明见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。
