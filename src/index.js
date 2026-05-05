export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    
    // --- PostHog Proxy Section ---
    // Handle the library script loading
    if (pathname.startsWith('/static/')) {
      return fetch(`https://us-assets.i.posthog.com${pathname}`);
    }

    // Handle event ingestion
    if (pathname.startsWith('/i/')) {
      return fetch(`https://us.i.posthog.com${pathname}`, request);
    }

    // --- Observability Section ---
    const cf = request.cf || {};
    const city = cf.city || "Unknown City";
    const country = cf.country || "Unknown Country";
    const region = cf.region || "Unknown Region";
    const colo = cf.colo || "Unknown Data Center"; 
    
    console.log(`[OBSERVABILITY] ${request.method} ${url.pathname} | Location: ${city}, ${region}, ${country} | DC: ${colo}`);

    // --- Asset Serving Section ---
    try {
      const response = await env.ASSETS.fetch(request);
      
      if (response.status !== 404) {
        return response;
      }

      return new Response("Not Found", { status: 404 });

    } catch (e) {
      return new Response(`Error serving asset: ${e.message}`, { status: 500 });
    }
  },
};
