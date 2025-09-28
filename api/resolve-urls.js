export default async function handler(req, res) {
  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
  
  // Get products with PH redirect URLs
  const { data: products } = await supabase
    .from('ai_tools')
    .select('id, website_url')
    .like('website_url', '%producthunt.com/r/%')
    .limit(10); // Start small - only 10 at a time
  
  if (!products || products.length === 0) {
    return res.json({ message: "No more URLs to resolve", completed: true });
  }
  
  const resolved = [];
  
  for (const product of products) {
    try {
      const response = await fetch(product.website_url, {
        method: 'HEAD',
        redirect: 'follow',
        timeout: 5000
      });
      
      const realUrl = response.url;
      
      if (realUrl && !realUrl.includes('producthunt.com')) {
        await supabase
          .from('ai_tools')
          .update({ website_url: realUrl })
          .eq('id', product.id);
        
        resolved.push({ id: product.id, resolved: realUrl });
      } else {
        // Mark as failed
        await supabase
          .from('ai_tools')
          .update({ website_url: null })
          .eq('id', product.id);
      }
      
      await sleep(2000); // 2 second delay
      
    } catch (error) {
      // Mark failed URLs as null
      await supabase
        .from('ai_tools')
        .update({ website_url: null })
        .eq('id', product.id);
    }
  }
  
  res.json({ 
    success: true, 
    processed: products.length,
    resolved: resolved.length
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
