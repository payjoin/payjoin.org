import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import tailwindPlugin from "./plugins/tailwind-config.cjs";

const config: Config = {
  title: "Payjoin",
  tagline: "Scale Bitcoin, save fees, preserve privacy",
  favicon: "img/monad.png",

  // Set the production url of your site here
  url: "https://payjoin.org",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "payjoin", // Usually your GitHub org/user name.
  projectName: "payjoin.org", // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },
  plugins: [tailwindPlugin,
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects: [
          {
            to: '/docs/why-payjoin/lightning', // New URL
            from: '/lightning', // Old URL
          },
          {
            to: '/docs/why-payjoin/scaling',
            from: '/scale',
          },
          {
            to: '/docs/why-payjoin/privacy',
            from: '/privacy',
          },
        ],
      },
    ],
  ],
  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            "https://github.com/payjoin/payjoin.org",
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            "https://github.com/payjoin/payjoin.org",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    // image: "img/docusaurus-social-card.jpg",
    colorMode: {
      defaultMode: "dark",
      disableSwitch: true,
    },
    navbar: {
      style: "dark",
      title: "Payjoin",
      logo: {
        alt: "Monad Logo",
        src: "img/monad.png",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "learnSidebar",
          position: "left",
          label: "Learn",
        },
        { href: "https://payjoindevkit.org/", label: "Dev Kit", position: "right" },
        {
          href: "https://discord.gg/6rJD9R684h",
          label: "Discord",
          position: "right",
        },
        {
          href: "https://payjoin.substack.com/",
          label: "News",
          position: "right",
        },
        {
          href: "https://github.com/payjoin",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Learn",
          items: [
            {
              label: "Payjoin Dev Kit",
              href: "https://payjoindevkit.org/",
            },
            {
              label: "Case Study",
              href: "https://bitcoin.design/guide/case-studies/payjoin/",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "Newsletter",
              href: "https://payjoin.substack.com/",
            },
            {
              label: "Discord",
              href: "https://discord.gg/6rJD9R684h",
            },
            {
              label: "Twitter",
              href: "https://twitter.com/payjoindevkit",
            },
            {
              label: "GitHub",
              href: "https://github.com/payjoin",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "Donate",
              href: "https://geyser.fund/project/payjoin/"
            },
            {
              label: "Roadmap",
              href: "https://github.com/orgs/payjoin/projects/1"
            }
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} The Payjoin Developers`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ["bash"]
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
