# Electronic Documentation Template

English | [简体中文](README.zh-CN.md)

[![Starlight](https://img.shields.io/badge/Astro-Starlight-blueviolet?logo=astro)](https://starlight.astro.build/)
[![Build](https://github.com/swcxito/electronic-docs-template/actions/workflows/deploy-docs.yml/badge.svg)](https://github.com/swcxito/electronic-docs-template/actions/workflows/deploy-docs.yml)
[![License](https://img.shields.io/badge/License-GPLv2-blue)](LICENSE)
[![Documentation license](https://img.shields.io/badge/Documentation-MIT-blue)](LICENSE.docs)

An **Astro Starlight** template for electronic circuit documentation, with bundled **CircuitJS** simulation and **WaveDrom** timing diagrams.

[Live documentation](https://swcxito.github.io/electronic-docs-template/) · [Original Sphinx version](https://github.com/swcxito/electronic-docs-template/tree/sphinx)

## Branches and migration

- **`main`**: the Starlight implementation, generated in a separate directory from the official `starlight` starter and then populated with the original examples and simulator assets.
- **`sphinx`**: the unchanged original source at `7c4917f1a892fb3e61fd36127532b5081e527fd8`, with its Python tooling and README.

The migration preserves Git history and the existing licenses. The original project was not used as the scaffold.

## Features

- Markdown and MDX, Starlight navigation, full-text search, syntax highlighting, and light/dark themes.
- Local CircuitJS assets, all original simulation options, compressed-data validation, and English/Chinese error messages.
- WaveDrom WaveJSON/JSON5 rendered into SVG at build time, without a runtime CDN dependency.
- GitHub Pages project-path support, including simulators embedded in nested pages.
- pnpm lockfile, Astro checks, component tests, browser tests, and GitHub Actions deployment.

## Quick start

Requirements: **Node.js 24+** and **pnpm 11.24.0** (pinned in `package.json`).

1. Select **Use this template** on GitHub and clone your repository.
2. Install dependencies and start Astro:

```sh
pnpm install
pnpm dev
```

Open the URL printed by Astro, normally `http://localhost:4321/electronic-docs-template/` for this repository.

```sh
pnpm build       # Generate dist/
pnpm preview     # Serve the production build over HTTP
```

## Writing documentation

Add `.md` or `.mdx` files to `src/content/docs/`, with `title` and optionally `description` in YAML frontmatter. Configure navigation and site metadata in `astro.config.mjs`.

MDX pages can import the following components. These paths assume the page is in `src/content/docs/guides/`.

### CircuitJS

Create a circuit in [CircuitJS](https://www.falstad.com/circuit/circuitjs.html), export its link from the File menu, and extract the `ctz` parameter.

```mdx
import Circuit from '../../../components/Circuit.astro';
import { circuitExample } from '../../../lib/examples';

<Circuit
  ctz={circuitExample}
  title="Example circuit"
  height={600}
  running={true}
  editable={false}
/>
```

Replace `circuitExample` with your exported data string. Boolean props must use braces, e.g. `running={false}`.

| Prop | Default | Description |
| --- | --- | --- |
| `ctz` | Required | Compressed CircuitJS circuit data |
| `title` | Interactive CircuitJS simulation | Accessible iframe title |
| `height` | `640` | Pixels as a number, or a CSS length such as `600px` |
| `width` | `100%` | Width, constrained to the page |
| `running` | `true` | Start simulation automatically |
| `hideMenu` | `true` | Hide the top menu |
| `hideSidebar` | `false` | Hide the simulator sidebar |
| `editable` | `false` | Allow circuit editing |
| `hideInfoBox` | `false` | Hide component information |
| `mouseWheelEdit` | `true` | Enable mouse-wheel parameter editing |
| `lang` | `en` | Error language (`zh-CN` selects Chinese) |

Invalid `ctz` data displays an error message instead of an iframe. The simulator is bundled unchanged in `public/circuitjs/`; no external simulator service is required.

### WaveDrom

```mdx
import WaveDrom from '../../../components/WaveDrom.astro';

<WaveDrom title="Clock and data transfer" source={{
  signal: [
    { name: 'clk', wave: 'P......' },
    { name: 'bus', wave: 'x.==.=x', data: ['head', 'body', 'tail'] },
    { name: 'wire', wave: '0.1..0.' },
  ],
}} />
```

`source` accepts a WaveJSON object or a JSON5 string. `signal`, `reg`, and `assign` diagrams and the default/narrow/lowkey skins are supported. SVGs are isolated image documents so multiple diagrams do not conflict. Invalid input fails the build. See the [WaveDrom tutorial](https://wavedrom.com/tutorial.html).

## Plugin migration

| Sphinx implementation | Starlight implementation |
| --- | --- |
| Sphinx + Alabaster | Astro + Starlight |
| `myst_parser` | Native Markdown/MDX |
| `sphinxcontrib.wavedrom` | `WaveDrom.astro` + `wavedrom` |
| `circuitjs_support` | `Circuit.astro` |
| Python `lzstring` | JavaScript `lz-string` |
| `html_extra_path` | `public/circuitjs/` |

Convert `.rst` and MyST directives/roles to Markdown/MDX; they are not interpreted by Starlight. Circuit option names change from kebab-case to camelCase (`hide-menu` → `hideMenu`, `mousewheel-edit` → `mouseWheelEdit`). Detailed notes live in [the migration guide](src/content/docs/reference/migration.md).

## Validation

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm validate
```

`validate` runs `pnpm check`, `pnpm test`, `pnpm build`, and `pnpm test:e2e`. Tests cover original circuit data, defaults and overrides, root/project URLs, WaveDrom output, invalid inputs, live simulation, page links, search, themes, and mobile navigation. On Linux, use `pnpm exec playwright install --with-deps chromium` when browser system libraries are missing.

## Deployment and configuration

In **Settings → Pages**, select **GitHub Actions**. A push to `main` validates and publishes `dist/`; pull requests validate without deploying.

The workflow obtains the public origin and base path from `actions/configure-pages`. The following environment variables support forks and other hosts:

| Variable | Default outside deployment CI |
| --- | --- |
| `GITHUB_REPOSITORY` | `swcxito/electronic-docs-template`; used for GitHub/edit links and default URL |
| `SITE_URL` | `https://OWNER.github.io` |
| `BASE_PATH` | `/REPOSITORY`, or `/` for `OWNER.github.io` repositories |

```sh
SITE_URL=https://docs.example.com BASE_PATH=/ pnpm build
```

Serve the output over HTTP rather than opening it with `file://`.

## Project structure

```text
astro.config.mjs          Site, navigation, and Pages path configuration
src/content/docs/        Markdown and MDX documentation
src/components/          Circuit.astro and WaveDrom.astro
src/lib/                 Validation, rendering, and original example data
src/styles/              Documentation styling
public/circuitjs/        Original bundled CircuitJS distribution
assets/                  Original README illustration assets
tests/                  Unit and production-browser tests
.github/workflows/       Validation and GitHub Pages deployment
```

## License and attribution

The template remains **GPLv2**: see [LICENSE](LICENSE). Documentation remains **MIT**: see [LICENSE.docs](LICENSE.docs). Authors retain copyright in new documentation they write with this template and may choose their own content license.

| Component | License / source |
| --- | --- |
| Astro / Starlight and official starter | MIT — [Astro](https://github.com/withastro/astro), [Starlight](https://github.com/withastro/starlight) |
| CircuitJS1 | GPLv2 — [pfalstad/circuitjs1](https://github.com/pfalstad/circuitjs1) |
| WaveDrom / ONML | MIT — [WaveDrom](https://github.com/wavedrom/wavedrom), [ONML](https://github.com/drom/onml) |
| lz-string | MIT — [lz-string](https://github.com/pieroxy/lz-string) |
| JSON5 | MIT — [JSON5](https://github.com/json5/json5) |

Bundled font notices are retained under `public/circuitjs/font/`. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for starter attribution.
