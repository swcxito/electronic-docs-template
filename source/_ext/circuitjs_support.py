from __future__ import annotations

from docutils import nodes

from sphinx.application import Sphinx
from sphinx.util.docutils import SphinxDirective, directives
from sphinx.util.typing import ExtensionMetadata
from sphinx.util import logging
logger = logging.getLogger(__name__)

from lzstring import LZString


# Simple i18n messages (default: English/Simplified Chinese)
MESSAGES = {
    'invalid_format': {
        'en': 'Unable to render circuit: invalid CircuitJS data format',
        'zh': '无法生成电路图：无效的 CircuitJS 数据格式',
    },
    'parse_error': {
        'en': 'Unable to render circuit: error parsing CircuitJS data - {error}',
        'zh': '无法生成电路图：解析 CircuitJS 数据时发生错误 - {error}',
    },
}


class CircuitJSDirective(SphinxDirective):
    """CircuitJS Directive to show the circuit"""

    required_arguments = 1
    # CircuitJS 指令参数选项，详见官方文档
    option_spec = {
        'height': directives.unchanged,  # iframe 高度
        'width': directives.unchanged,  # iframe 宽度
        'running': directives.unchanged,  # 启动时是否运行仿真
        'hide-menu': directives.unchanged,  # 隐藏菜单
        'hide-sidebar': directives.unchanged,  # 隐藏侧边栏
        'editable': directives.unchanged,  # 允许编辑电路
        'hide-infobox': directives.unchanged,  # 隐藏信息框
        'mousewheel-edit': directives.unchanged,  # 允许鼠标滚轮修改参数

        # Following options are not used in this directive
        # 'euroResistors': directives.unchanged,  # 强制使用欧式电阻符号
        # 'IECGates': directives.unchanged,  # 强制使用 IEC 逻辑门符号
        # 'usResistors': directives.unchanged,  # 强制使用美式电阻符号
        # 'whiteBackground': directives.unchanged,  # 白色背景 true/false
        # 'conventionalCurrent': directives.unchanged,  # 传统电流方向 true/false
        # 'positiveColor': directives.unchanged,  # 正电压颜色（如 %2300ff00）
        # 'negativeColor': directives.unchanged,  # 负电压颜色
        # 'selectColor': directives.unchanged,  # 选中颜色
        # 'currentColor': directives.unchanged,  # 电流颜色
        # 'mouseMode': directives.unchanged,  # 初始鼠标模式或 UI 操作
    }

    # --- i18n helpers ---
    def _current_lang(self) -> str:
        """Detect current language from Sphinx config only; default to 'en'."""
        cfg_lang = getattr(self.config, 'language', None)
        if cfg_lang and str(cfg_lang).strip().lower().startswith('zh'):
            return 'zh'
        return 'en'

    def _t(self, key: str, **kwargs) -> str:
        """Translate a message key with optional formatting args."""
        lang = self._current_lang()
        template = MESSAGES.get(key, {}).get(lang) or MESSAGES.get(key, {}).get('en') or key
        try:
            return template.format(**kwargs)
        except Exception:
            return template

    def run(self) -> list[nodes.Node]:

        lz = LZString()
        try:
            text = lz.decompressFromEncodedURIComponent(self.arguments[0])
            if text is None or not text.startswith('$ '):
                error_msg = self._t('invalid_format')
                logger.warning("invalid circuit ctz data detected", location=self.state.document.current_source)
                # 创建包含错误信息的节点
                error_node = nodes.error()
                error_node += nodes.paragraph(text=error_msg)
                return [error_node]
        except Exception as e:
            error_msg = self._t('parse_error', error=str(e))
            logger.warning("invalid circuit ctz data detected: %s", e, location=self.state.document.current_source)
            # 创建包含具体错误信息的节点
            error_node = nodes.error()
            error_node += nodes.paragraph(text=error_msg)
            return [error_node]

        # 合并参数，简化代码
        defaults = {
            'height': '640',
            'width': '100%',
            'running': 'true',
            'hide-menu': 'true',
            'hide-sidebar': 'false',
            'editable': 'false',
            'hide-infobox': 'false',
            'mousewheel-edit': 'true',
        }
        opts = {k: self.options.get(k, default_value) for k, default_value in defaults.items()}

        params = '&'.join([
            f'ctz={self.arguments[0]}',
            f'running={opts["running"]}',
            f'hideMenu={opts["hide-menu"]}',
            f'hideSidebar={opts["hide-sidebar"]}',
            f'editable={opts["editable"]}',
            f'hideInfoBox={opts["hide-infobox"]}',
            f'mouseWheelEdit={opts["mousewheel-edit"]}',
        ])

        paragraph_node = nodes.raw(
            format='html',
            text=(
                f'<iframe src="/circuitjs/circuitjs.html?{params}" '
                f'width="{opts["width"]}" height="{opts["height"]}" frameborder="0"></iframe>'
            ),
        )
        return [paragraph_node]


def setup(app: Sphinx) -> ExtensionMetadata:
    app.add_directive('circuit', CircuitJSDirective)

    return {
        'version': '0.1',
        'parallel_read_safe': True,
        'parallel_write_safe': True,
    }