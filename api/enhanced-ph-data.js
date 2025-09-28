// SIMPLE WORKING VERSION - Replace your api/enhanced-ph-data.js with this

export default async function handler(req, res) {
  try {
    // Test Product Hunt API first
    const response = await fetch('https://api.producthunt.com/v2/api/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PH_DEV_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: `
          query {
            posts(first: 5) {
              edges {
                node {
                  id
                  name
                  tagline
                  description
                  slug
                  url
                  votesCount
                  commentsCount
                  createdAt
                  thumbnail {
                    url
                  }
                  makers {
                    id
                    name
                    username
                  }
                  topics {
                    edges {
                      node {
                        name
                        slug
                      }
                    }
                  }
                }
              }
            }
          }
        `
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const result = await response.json();
    
    if (result.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
    }

    if (!result.data || !result.data.posts) {
      throw new Error('Invalid API response structure');
    }

    // Process the data
    const products = result.data.posts.edges.map(edge => {
      const product = edge.node;
      const makers = product.makers || [];
      const categories = product.topics.edges.map(e => e.node.name);
      
      return {
        id: product.id,
        name: product.name,
        description: product.tagline, // Map tagline to description
        slug: product.slug,
        website_url: product.url,
        votes: product.votesCount,
        comments: product.commentsCount,
        thumbnail_url: product.thumbnail?.url,
        posted_at: product.createdAt,
        makers: makers.map(m => m.name).join(', '),
        categories: categories.join(', '),
        category_slugs: product.topics.edges.map(e => e.node.slug).join(', '),
        
        // Enhanced fields with basic analysis
        pricing_model: detectPricingModel(product.description || ''),
        business_model: detectBusinessModel(product.description || ''),
        estimated_traffic: product.votesCount * 300,
        social_twitter: makers.find(m => m.username)?.username || null,
        upvote_velocity: calculateVelocity(product.votesCount, product.createdAt)
      };
    });

    // Return success without database storage for now
    res.json({ 
      success: true, 
      count: products.length,
      products: products.slice(0, 2), // Show first 2 products
      message: "Data retrieved successfully (not stored yet)"
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
}

function detectPricingModel(text) {
  const lower = text.toLowerCase();
  if (lower.includes('free') && lower.includes('premium')) return 'freemium';
  if (lower.includes('subscription')) return 'subscription';
  if (lower.includes('free')) return 'free';
  return 'unknown';
}

function detectBusinessModel(text) {
  const lower = text.toLowerCase();
  if (lower.includes('b2b') || lower.includes('enterprise')) return 'B2B';
  if (lower.includes('b2c') || lower.includes('consumer')) return 'B2C';
  return 'B2B';
}

function calculateVelocity(votes, createdAt) {
  const hoursLive = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60);
  return hoursLive > 0 ? parseFloat((votes / hoursLive).toFixed(2)) : 0;
}
