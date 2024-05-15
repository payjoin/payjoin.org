import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/__docusaurus/debug',
    component: ComponentCreator('/__docusaurus/debug', 'f17'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/config',
    component: ComponentCreator('/__docusaurus/debug/config', '37e'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/content',
    component: ComponentCreator('/__docusaurus/debug/content', '068'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/globalData',
    component: ComponentCreator('/__docusaurus/debug/globalData', '642'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/metadata',
    component: ComponentCreator('/__docusaurus/debug/metadata', '735'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/registry',
    component: ComponentCreator('/__docusaurus/debug/registry', '593'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/routes',
    component: ComponentCreator('/__docusaurus/debug/routes', '779'),
    exact: true
  },
  {
    path: '/blog',
    component: ComponentCreator('/blog', 'f43'),
    exact: true
  },
  {
    path: '/blog/archive',
    component: ComponentCreator('/blog/archive', '218'),
    exact: true
  },
  {
    path: '/blog/first-blog-post',
    component: ComponentCreator('/blog/first-blog-post', '23d'),
    exact: true
  },
  {
    path: '/blog/long-blog-post',
    component: ComponentCreator('/blog/long-blog-post', 'f42'),
    exact: true
  },
  {
    path: '/blog/mdx-blog-post',
    component: ComponentCreator('/blog/mdx-blog-post', '2d0'),
    exact: true
  },
  {
    path: '/blog/tags',
    component: ComponentCreator('/blog/tags', 'a61'),
    exact: true
  },
  {
    path: '/blog/tags/docusaurus',
    component: ComponentCreator('/blog/tags/docusaurus', '216'),
    exact: true
  },
  {
    path: '/blog/tags/facebook',
    component: ComponentCreator('/blog/tags/facebook', 'a94'),
    exact: true
  },
  {
    path: '/blog/tags/hello',
    component: ComponentCreator('/blog/tags/hello', 'b40'),
    exact: true
  },
  {
    path: '/blog/tags/hola',
    component: ComponentCreator('/blog/tags/hola', '082'),
    exact: true
  },
  {
    path: '/blog/welcome',
    component: ComponentCreator('/blog/welcome', '336'),
    exact: true
  },
  {
    path: '/markdown-page',
    component: ComponentCreator('/markdown-page', '6d7'),
    exact: true
  },
  {
    path: '/docs',
    component: ComponentCreator('/docs', 'cf7'),
    routes: [
      {
        path: '/docs',
        component: ComponentCreator('/docs', '059'),
        routes: [
          {
            path: '/docs',
            component: ComponentCreator('/docs', '643'),
            routes: [
              {
                path: '/docs/category/how-it-works',
                component: ComponentCreator('/docs/category/how-it-works', 'c3d'),
                exact: true,
                sidebar: "learnSidebar"
              },
              {
                path: '/docs/category/tutorials',
                component: ComponentCreator('/docs/category/tutorials', 'f03'),
                exact: true,
                sidebar: "learnSidebar"
              },
              {
                path: '/docs/how-it-works/v1',
                component: ComponentCreator('/docs/how-it-works/v1', 'e53'),
                exact: true,
                sidebar: "learnSidebar"
              },
              {
                path: '/docs/how-it-works/v2',
                component: ComponentCreator('/docs/how-it-works/v2', 'c39'),
                exact: true,
                sidebar: "learnSidebar"
              },
              {
                path: '/docs/intro',
                component: ComponentCreator('/docs/intro', 'b1e'),
                exact: true,
                sidebar: "learnSidebar"
              },
              {
                path: '/docs/tutorials/payjoin-cli',
                component: ComponentCreator('/docs/tutorials/payjoin-cli', 'a3c'),
                exact: true,
                sidebar: "learnSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/',
    component: ComponentCreator('/', '533'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
