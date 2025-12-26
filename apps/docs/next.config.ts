import nextra from 'nextra';

const withNextra = nextra({
  contentDirBasePath: '/docs',
  defaultShowCopyCode: true,
  search: {
    codeblocks: true,
  },
  // Use built-in Shiki themes for syntax highlighting
  mdxOptions: {
    rehypePrettyCodeOptions: {
      theme: {
        dark: 'github-dark',
        light: 'github-light',
      },
    },
  },
});

export default withNextra({
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return [
      {
        source: '/documentation',
        destination: '/docs',
        permanent: true,
      },
    ];
  },
});
