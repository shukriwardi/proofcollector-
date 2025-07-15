
import { useEffect } from 'react';

export const SitemapHandler = () => {
  useEffect(() => {
    // Redirect to the edge function that serves the actual sitemap
    window.location.replace('https://zzfyvjlqzblvufeoqslr.supabase.co/functions/v1/sitemap');
  }, []);

  return (
    <div style={{ 
      fontFamily: 'monospace', 
      padding: '20px',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <h1>Redirecting to sitemap.xml...</h1>
      <p>If you're not redirected automatically, <a href="https://zzfyvjlqzblvufeoqslr.supabase.co/functions/v1/sitemap">click here</a>.</p>
    </div>
  );
};
