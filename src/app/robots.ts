import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/dashboard/', '/api/', '/guest/'],
        },
        sitemap: 'https://riva-jo.me/sitemap.xml',
    };
}
