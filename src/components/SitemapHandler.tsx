
import { useEffect } from 'react';
import { generateSitemap } from '@/api/sitemap';

export const SitemapHandler = () => {
  useEffect(() => {
    const serveSitemap = async () => {
      try {
        const sitemapXml = await generateSitemap();
        
        // Clear the page and serve raw XML
        document.open();
        document.write(sitemapXml);
        document.close();
        
        // Set proper content type
        if (document.documentElement) {
          document.documentElement.setAttribute('content-type', 'application/xml');
        }
      } catch (error) {
        console.error('Error serving sitemap:', error);
        document.open();
        document.write('<error>Failed to generate sitemap</error>');
        document.close();
      }
    };

    serveSitemap();
  }, []);

  return null;
};
