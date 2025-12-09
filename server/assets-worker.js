// Cloudflare Worker for serving R2 assets
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    };
    
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }
    
    try {
      // Remove leading slash from path
      const key = path.substring(1);
      
      if (!key) {
        return new Response('Not Found', { status: 404, headers: corsHeaders });
      }
      
      // Get object from R2
      const object = await env.blockchainvibe_assets.get(key);
      
      if (!object) {
        return new Response('Not Found', { status: 404, headers: corsHeaders });
      }
      
      // Get object headers
      const headers = new Headers(corsHeaders);
      
      // Set content type from object metadata
      if (object.httpMetadata?.contentType) {
        headers.set('Content-Type', object.httpMetadata.contentType);
      }
      
      // Set cache control
      if (object.httpMetadata?.cacheControl) {
        headers.set('Cache-Control', object.httpMetadata.cacheControl);
      }
      
      // Return object body
      return new Response(object.body, { headers });
      
    } catch (error) {
      console.error('Asset serving error:', error);
      return new Response('Internal Server Error', { 
        status: 500, 
        headers: corsHeaders 
      });
    }
  }
};
