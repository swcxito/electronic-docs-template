// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// configure-pages supplies these values in CI; override for a custom domain.
const repository = process.env.GITHUB_REPOSITORY || 'swcxito/electronic-docs-template';
const [owner, name] = repository.split('/');
const site = process.env.SITE_URL || `https://${owner}.github.io`;
const base = process.env.BASE_PATH ?? (name === `${owner}.github.io` ? '/' : `/${name}`);

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  integrations: [
    starlight({
      title: 'Electronic Docs',
      description: 'Electronic circuit documentation with interactive simulations and timing diagrams.',
      social: [{ icon: 'github', label: 'GitHub', href: `https://github.com/${repository}` }],
      editLink: { baseUrl: `https://github.com/${repository}/edit/main/` },
      customCss: ['./src/styles/custom.css'],
      sidebar: [
        { label: 'Overview', slug: '' },
        { label: 'Getting started', slug: 'guides/getting-started' },
        { label: 'Circuit simulation', slug: 'guides/circuits' },
        { label: 'Timing diagrams', slug: 'guides/timing-diagrams' },
        { label: 'Migration from Sphinx', slug: 'reference/migration' },
      ],
    }),
  ],
});
