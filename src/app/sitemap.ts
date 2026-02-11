import type { MetadataRoute } from 'next';

const BASE_URL = 'https://riva-jo.me';

export default function sitemap(): MetadataRoute.Sitemap {
    const staticPages = [
        '',
        '/en',
        '/ar',
        '/en/chalets',
        '/ar/chalets',
        '/en/about',
        '/ar/about',
        '/en/contact',
        '/ar/contact',
        '/en/rewards',
        '/ar/rewards',
        '/en/faq',
        '/ar/faq',
        '/en/terms',
        '/ar/terms',
        '/en/privacy',
        '/ar/privacy',
    ];

    return staticPages.map((path) => ({
        url: `${BASE_URL}${path}`,
        lastModified: new Date(),
        changeFrequency: path.includes('chalets') ? 'daily' : 'weekly' as const,
        priority: path === '' || path === '/en' || path === '/ar' ? 1.0 : 0.8,
    }));
}
