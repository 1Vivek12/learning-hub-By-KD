import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://learninghub.io';

  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/course/*', '/courses'],
      disallow: [
        '/api/',
        '/admin/',
        '/dashboard/',
        '/checkout/',
        '/player/',
        '/verify/', // May want to allow verify if certs are public? Disallow by default for privacy
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
