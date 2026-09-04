---
title: Migration from Sphinx
description: Extension mapping and migration notes for the original Sphinx template.
---

The Starlight implementation was generated in a separate directory using the official `starlight` starter. The original Sphinx source and history are preserved on the repository's `sphinx` branch at commit `7c4917f1a892fb3e61fd36127532b5081e527fd8`.

## Extension mapping

| Original | Starlight implementation |
| --- | --- |
| Sphinx + Alabaster | Astro + Starlight |
| `myst_parser` | Native Markdown and MDX support |
| `sphinxcontrib.wavedrom` | `WaveDrom.astro`, using the `wavedrom` package at build time |
| Custom `circuitjs_support` | `Circuit.astro`, with the same validation and simulation defaults |
| Python `lzstring` | JavaScript `lz-string` |
| `html_extra_path` | `public/circuitjs/`, copied unchanged from the original simulator assets |
| `toctree` | Starlight sidebar |
| Sphinx GitHub Actions | pnpm validation, build, browser tests, and GitHub Pages deployment |

## Convert documents

Starlight accepts `.md` and `.mdx`. It does not parse `.rst`, MyST directives, or Sphinx roles. Convert headings, links, directives, and cross-references to Markdown/MDX and add frontmatter with `title`.

The original `source/index.rst` examples are preserved on the overview and component guide pages, including the invalid CircuitJS example. The compressed circuit data and waveform source are retained in `src/lib/examples.ts`.

## Circuit directive options

Replace `.. circuit:: DATA` with `<Circuit ctz="DATA" />` in MDX. Convert option names as follows:

| Sphinx option | MDX prop |
| --- | --- |
| `hide-menu` | `hideMenu` |
| `hide-sidebar` | `hideSidebar` |
| `hide-infobox` | `hideInfoBox` |
| `mousewheel-edit` | `mouseWheelEdit` |
| `running`, `editable`, `height`, `width` | Same names |

Use boolean expressions such as `hideMenu={false}`. Error messages support English and Chinese via `lang`. Invalid circuit data displays an error message; invalid WaveDrom data fails the build.

## Legacy build

To continue using the original Python tooling, check out `sphinx` and follow that branch's README. New Starlight changes belong on `main`.
