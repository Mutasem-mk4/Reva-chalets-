import { getChalets } from '@/lib/data';
import type { MetadataRoute } from 'next';

const BASE_URL = 'https://riva-jo.me';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const chalets = await getChalets();

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

    const staticUrls = staticPages.map((path) => ({
        url: `${BASE_URL}${path}`,
        lastModified: new Date(),
        changeFrequency: path.includes('chalets') ? 'daily' : 'weekly' as const,
        priority: path === '' || path === '/en' || path === '/ar' ? 1.0 : 0.8,
    }));

    const chaletUrls = chalets.flatMap((chalet) => [
        {
            url: `${BASE_URL}/en/chalets/${chalet.id}`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/ar/chalets/${chalet.id}`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.9,
        }
    ]);

    return [...staticUrls, ...chaletUrls] as MetadataRoute.Sitemap;
}
