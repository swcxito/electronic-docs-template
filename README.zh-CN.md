# 电子文档模板（Electronic Documentation Template）
[![Sphinx](https://img.shields.io/badge/Using-Sphinx-green?logo=sphinx)](https://github.com/sphinx-doc/sphinx) [![License](https://img.shields.io/badge/License-GPLv2-blue)](LICENSE)
[![Using Electronic Documentation Template](https://img.shields.io/badge/Using-Electronic%20Documentation%20Template-blue?style=flat-square&logo=github)](https://github.com/swcxito/electronic-docs-template)

[English](README.md) | 简体中文

一个专为电子电路文档而设计的 Sphinx 模板，内置电路仿真与时序图功能，支持交互式演示与精美波形渲染。

## 功能特性

- 📚 基于 Sphinx 的强大文档能力
- ⚡ 集成 CircuitJS 电路仿真，支持交互演示

<img src="./assets/image-circuitjs.png" alt="image-circuitjs" style="zoom: 33%;" />

- 📊 支持 WaveDrom 时序图与波形绘制

![wavedrom](./assets/wavedrom.svg)

## 快速开始

### 创建你的仓库
1. 点击「Use this template」
2. Git 克隆到本地
3. 进入仓库目录

如果你在使用本模板，欢迎在你的 README 中放置如下徽章：

```md
[![Using Electronic Documentation Template](https://img.shields.io/badge/Using-Electronic%20Documentation%20Template-blue?style=flat-square&logo=github)](https://github.com/swcxito/electronic-docs-template)
```

### 构建文档

#### 方式一：使用 [![uv](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/astral-sh/uv/main/assets/badge/v0.json)](https://github.com/astral-sh/uv)（推荐）
1) 安装依赖（首次执行）：

```powershell
uv sync
```

2) 构建文档：

- 在 Windows（PowerShell）：

```powershell
# 使用 uv 直接调用 sphinx-build（跨平台一致）
uv run sphinx-build -M html source build

# 或使用批处理脚本（等价）
# uv run .\make.bat html
```

- 在 Linux/macOS：

```bash
uv run make html
```

#### 方式二：使用 pip（建议先创建虚拟环境）
1) 安装依赖（首次执行）：

```powershell
pip install -r requirements.txt
```

2) 构建文档：

- 在 Windows（PowerShell）：

```powershell
.\make.bat html
```

- 在 Linux/macOS：

```bash
make html
```

### 查看生成的文档
> 由于现代浏览器的安全策略，直接从文件系统打开 HTML 时，部分功能（如 CircuitJS 仿真）可能无法正常运行。建议通过本地 Web 服务器查看。

1) 启动简易 HTTP 服务器：

```powershell
python -m http.server --directory build/html 8080
```

2) 浏览器访问：`http://localhost:8080`

## 使用说明

### 编写文档
本模板同时支持 reStructuredText 与 Markdown：

- reStructuredText：使用 `.rst` 文件，获得完整的 Sphinx 能力
- Markdown：使用 `.md` 文件，语法更简洁（通过 MyST 解析器）

Sphinx 文档： [![Sphinx Documentation](https://img.shields.io/badge/Sphinx-docs-blue?logo=sphinx)](https://www.sphinx-doc.org/)

### 电路仿真（CircuitJS）

#### 获取电路数据
1. 打开 [CircuitJS1](https://www.falstad.com/circuit/circuitjs.html)
2. 新建或加载电路
3. 依次点击「File」→「Export to URL」，复制生成的 URL
4. 从 URL 中提取电路数据（`ctz=` 后面的部分）

#### 在文档中嵌入交互式仿真
使用自定义 `circuit` 指令：

```rst
.. circuit:: your-circuit-data-here
   :height: 640
   :width: 100%
   :running: true
   :editable: false
```

可选项说明：

- `height`：iframe 高度（默认 640）
- `width`：iframe 宽度（默认 100%）
- `running`：是否自动开始仿真（默认 true）
- `hideMenu`：是否隐藏顶部菜单（默认 true）
- `hideSidebar`：是否隐藏右侧栏（默认 false）
- `editable`：是否允许编辑电路（默认 false）
- `hideInfoBox`：是否隐藏器件信息框（默认 false）
- `mouseWheelEdit`：是否启用滚轮修改参数（默认 true）

### 时序图（WaveDrom）
使用 WaveDrom 语法创建波形图：

```rst
.. wavedrom::

   { "signal": [
     { "name": "clk",  "wave": "P......" },
     { "name": "bus",  "wave": "x.==.=x", "data": ["head", "body", "tail"] },
     { "name": "wire", "wave": "0.1..0." }
   ]}
```

WaveDrom 教程： [![WaveDrom Documentation](https://img.shields.io/badge/WaveDrom-tutorial-green?logo=wavedrom)](https://wavedrom.com/tutorial.html)

## 配置说明
主要配置位于 `source/conf.py`：

- 项目信息：`project`、`author`、`copyright`
- 扩展：添加或移除 Sphinx 扩展
- 主题：配置 HTML 主题与外观

## 贡献
1. Fork 本仓库
2. 创建功能分支
3. 完成你的修改
4. 确认文档可以正常构建
5. 发起 Pull Request

## 📜 许可证

### 项目许可
本项目 **electronic-docs-template** 采用 **GNU General Public License, Version 2 (GPLv2)** 授权。
详见 [LICENSE](./LICENSE)。

© 2025 swcxito.
在 GPLv2 条款下，你可以自由使用、修改和再分发本模板。

---

### 集成的第三方组件

| 组件 | 源码 | 许可证 |
| - | - | - |
| **Sphinx** | [![GitHub](https://img.shields.io/badge/source-sphinx-blue?logo=github)](https://github.com/sphinx-doc/sphinx) | ![BSD License](https://img.shields.io/badge/license-BSD-green) |
| **sphinx-wavedrom** | [![GitHub](https://img.shields.io/badge/source-sphinx--wavedrom-blue?logo=github)](https://github.com/bavovanachte/sphinx-wavedrom) | ![MIT License](https://img.shields.io/badge/license-MIT-green) |
| **CircuitJS1** | [![GitHub](https://img.shields.io/badge/source-circuitjs1-blue?logo=github)](https://github.com/pfalstad/circuitjs1) | ![GPLv2 License](https://img.shields.io/badge/license-GPLv2-blue) |

---

### 文档内容许可
尽管本模板以 **GPLv2** 授权，使用本模板创作的「文档内容」（例如你编写的 `.rst` 或 `.md` 文件）
可以由作者自行选择许可协议，例如：

- [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
- [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)
- [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/)
- 或由作者选择的其他协议

使用本模板创作的新文档，其著作权仍完全归作者本人所有。

## 版本历史

- v0.1（2025）：初始模板发布
  - 基础 Sphinx 配置
  - 集成 CircuitJS
  - 支持 WaveDrom
  - RTD 主题配置

---

作者：swcxito  
版本：0.1  
最后更新：2025
