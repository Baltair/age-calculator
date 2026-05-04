export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // --- Observability Section ---
    // Cloudflare Workers provide a 'cf' object with rich geolocation data for every request.
    const cf = request.cf || {};
    const city = cf.city || "Unknown City";
    const country = cf.country || "Unknown Country";
    const region = cf.region || "Unknown Region";
    const colo = cf.colo || "Unknown Data Center"; // Cloudflare Data Center code
    
    // Basic server-side logging (visible in Cloudflare dashboard or Wrangler logs)
    console.log(`[OBSERVABILITY] ${request.method} ${url.pathname} | Location: ${city}, ${region}, ${country} | DC: ${colo}`);

    // Optional: Log more details if needed
    // const ip = request.headers.get("cf-connecting-ip") || "Unknown IP";
    // const ua = request.headers.get("user-agent") || "Unknown UA";
    // console.log(`[DEBUG] IP: ${ip} | UA: ${ua}`);

    // --- Asset Serving Section ---
    // This serves files from the 'public' directory defined in wrangler.toml
    try {
      const response = await env.ASSETS.fetch(request);
      
      // If the asset exists, return it
      if (response.status !== 404) {
        return response;
      }

      // If not found, you could return a custom 404 page or fall back to index.html (for SPAs)
      return new Response("Not Found", { status: 404 });

    } catch (e) {
      return new Response(`Error serving asset: ${e.message}`, { status: 500 });
    }
  },
};
