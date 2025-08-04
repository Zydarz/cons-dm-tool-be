module.exports = {
    title: 'NestJS Backend nest boilerplate 🎉',
    description: `NestJS Backend boilerplate wrote in typescript`,
    base: process.env.DEPLOY_ENV === 'gh-pages' ? '/awesome-nest-boilerplate/' : '/',
    themeConfig: {
        sidebar: [
            ['/', 'Introduction'],
            '/docs/development',
            '/docs/architecture',
            // '/docs/tech',
            // '/docs/routing',
            // '/docs/state',
            // '/docs/linting',
            // '/docs/editors',
            // '/docs/production',
            // '/docs/troubleshooting',
        ],
    },
};
