
import { supabase } from "@/integrations/supabase/client";

export async function generateSitemap(): Promise<string> {
  const baseUrl = "https://proofcollector.shacnisaas.com";
  
  // Start building the sitemap XML
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  // Add homepage
  sitemap += `
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>`;

  try {
    // Fetch all surveys for submit/link pages
    const { data: surveys, error: surveysError } = await supabase
      .from('surveys')
      .select('id, updated_at');

    if (!surveysError && surveys) {
      surveys.forEach(survey => {
        const lastmod = survey.updated_at ? new Date(survey.updated_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
        
        // Add /link/[id] page
        sitemap += `
  <url>
    <loc>${baseUrl}/link/${survey.id}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
    <lastmod>${lastmod}</lastmod>
  </url>`;

        // Add /submit/[id] page
        sitemap += `
  <url>
    <loc>${baseUrl}/submit/${survey.id}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
    <lastmod>${lastmod}</lastmod>
  </url>`;
      });
    }

    // Fetch all testimonials for /t/[id] pages
    const { data: testimonials, error: testimonialsError } = await supabase
      .from('testimonials')
      .select('id, created_at');

    if (!testimonialsError && testimonials) {
      testimonials.forEach(testimonial => {
        const lastmod = testimonial.created_at ? new Date(testimonial.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
        
        sitemap += `
  <url>
    <loc>${baseUrl}/t/${testimonial.id}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <lastmod>${lastmod}</lastmod>
  </url>`;
      });
    }

  } catch (error) {
    console.error('Error fetching data for sitemap:', error);
  }

  // Close the sitemap
  sitemap += `
</urlset>`;

  return sitemap;
}
