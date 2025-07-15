
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Database {
  public: {
    Tables: {
      surveys: {
        Row: {
          id: string;
          updated_at: string | null;
        };
      };
      testimonials: {
        Row: {
          id: string;
          created_at: string | null;
        };
      };
    };
  };
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client with service role key for public access
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

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

    // Close the sitemap
    sitemap += `
</urlset>`;

    return new Response(sitemap, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml',
        'Cache-Control': 'max-age=3600', // Cache for 1 hour
      },
    });

  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Return a basic sitemap on error
    const errorSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://proofcollector.shacnisaas.com/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>
</urlset>`;

    return new Response(errorSitemap, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml',
      },
    });
  }
});
