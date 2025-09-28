// STREAMLINED MAXIMUM PRODUCT HUNT EXTRACTION
// ALL products, essential fields only

export default async function handler(req, res) {
  const allProducts = []; // Move outside try block
  
  try {
    let hasNextPage = true;
    let cursor = null;
    let pageCount = 0;
    const maxPages = 25; // Reduce to avoid rate limits

    while (hasNextPage && pageCount < maxPages) {
      const query = `
        query($cursor: String) {
          posts(first: 20, after: $cursor) {
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
                  name
                  username
                  twitterUsername
                  websiteUrl
                }
                
                topics {
                  edges {
                    node {
                      name
                      slug
                    }
                  }
                }
                
                website
                featuredAt
              }
            }
            pageInfo {
              endCursor
              hasNextPage
            }
          }
        }
      `;

      const response = await fetch('https://api.producthunt.com/v2/api/graphql', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.PH_DEV_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query, variables: { cursor } })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.errors) {
        console.log('GraphQL errors:', result.errors);
        if (!result.data?.posts) {
          throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
        }
      }

      const posts = result.data.posts;
      
      // Process ALL products with streamlined data
      const processedProducts = posts.edges.map(edge => 
        processStreamlinedProduct(edge.node)
      );

      allProducts.push(...processedProducts);
      
      hasNextPage = posts.pageInfo.hasNextPage;
      cursor = posts.pageInfo.endCursor;
      pageCount++;
      
      console.log(`Page ${pageCount} processed, total: ${allProducts.length}`);
      
      await sleep(3000); // Increase delay to 3 seconds
    }

    // Store all products
    if (allProducts.length > 0) {
      await storeStreamlinedData(allProducts);
    }

    res.json({
      success: true,
      total_products: allProducts.length,
      pages_processed: pageCount,
      message: "Maximum Product Hunt extraction completed",
      extraction_stats: {
        products_with_makers: allProducts.filter(p => p.makers).length,
        products_with_social: allProducts.filter(p => p.social_twitter).length,
        unique_categories: [...new Set(allProducts.flatMap(p => p.categories.split(', ')))].length,
        featured_products: allProducts.filter(p => p.is_featured).length
      }
    });

  } catch (error) {
    console.error('Maximum extraction error:', error);
    res.status(500).json({ 
      error: error.message,
      products_processed: allProducts?.length || 0
    });
  }
}

function processStreamlinedProduct(product) {
  const makers = product.makers || [];
  const topics = product.topics?.edges || [];
  
  const allText = [
    product.name || '',
    product.tagline || '',
    product.description || ''
  ].join(' ').toLowerCase();
  
  return {
    // Core product data (your existing structure)
    id: product.id,
    name: product.name,
    title: product.name,
    description: product.tagline,
    slug: product.slug,
    url: product.url,
    website_url: product.url,
    votes: product.votesCount,
    comments: product.commentsCount,
    thumbnail_url: product.thumbnail?.url,
    posted_at: product.createdAt,
    
    // Categories
    categories: topics.map(t => t.node.name).join(', '),
    category_slugs: topics.map(t => t.node.slug).join(', '),
    topics: topics.map(t => ({
      name: t.node.name,
      slug: t.node.slug
    })),
    
    // Essential maker data
    makers: makers.map(m => m.name).join(', '),
    
    // Essential social/contact
    social_twitter: extractTwitterHandle(makers, product),
    website: product.website || product.url,
    
    // Essential business data
    pricing_model: detectPricingModel(allText),
    business_model: detectBusinessModel(allText),
    
    // Essential categorization
    primary_category: detectPrimaryCategory(topics),
    target_audience: detectTargetAudience(allText),
    
    // Essential metrics
    popularity_score: product.votesCount + (product.commentsCount * 2),
    upvote_velocity: calculateUpvoteVelocity(product.votesCount, product.createdAt),
    
    // Essential status
    is_featured: product.featuredAt ? true : false,
    
    // Essential tech info
    platforms: detectPlatforms(allText),
    has_api: allText.includes('api'),
    has_mobile_app: detectMobileApp(allText),
    
    // Tags for filtering
    tags: generateTags(allText, topics)
  };
}

// STREAMLINED HELPER FUNCTIONS

function extractTwitterHandle(makers, product) {
  const makerTwitter = makers.find(m => m.twitterUsername)?.twitterUsername;
  if (makerTwitter) return makerTwitter;
  
  return null;
}

function detectPricingModel(text) {
  if (text.includes('free') && text.includes('premium')) return 'Freemium';
  if (text.includes('subscription') || text.includes('monthly')) return 'Subscription';
  if (text.includes('free')) return 'Free';
  if (text.includes('one-time')) return 'One-time';
  return 'Contact for Pricing';
}

function detectBusinessModel(text) {
  if (text.includes('b2b') || text.includes('enterprise') || text.includes('business')) return 'B2B';
  if (text.includes('b2c') || text.includes('consumer')) return 'B2C';
  if (text.includes('marketplace')) return 'Marketplace';
  return 'B2B';
}

function detectPrimaryCategory(topics) {
  if (topics.length === 0) return 'General';
  
  const topicNames = topics.map(t => t.node.name.toLowerCase());
  
  if (topicNames.some(t => t.includes('ai') || t.includes('artificial intelligence'))) return 'AI Tools';
  if (topicNames.some(t => t.includes('developer') || t.includes('api'))) return 'Developer Tools';
  if (topicNames.some(t => t.includes('productivity'))) return 'Productivity';
  if (topicNames.some(t => t.includes('design'))) return 'Design';
  if (topicNames.some(t => t.includes('marketing'))) return 'Marketing';
  if (topicNames.some(t => t.includes('analytics'))) return 'Analytics';
  
  return topics[0].node.name; // First topic as primary
}

function detectTargetAudience(text) {
  if (text.includes('developer') || text.includes('programmer')) return 'Developers';
  if (text.includes('designer')) return 'Designers';
  if (text.includes('marketer')) return 'Marketers';
  if (text.includes('business') || text.includes('enterprise')) return 'Business';
  if (text.includes('creator') || text.includes('content')) return 'Content Creators';
  return 'General Users';
}

function detectPlatforms(text) {
  const platforms = [];
  
  if (text.includes('web') || text.includes('browser')) platforms.push('Web');
  if (text.includes('ios') || text.includes('iphone')) platforms.push('iOS');
  if (text.includes('android')) platforms.push('Android');
  if (text.includes('mac')) platforms.push('macOS');
  if (text.includes('windows')) platforms.push('Windows');
  if (text.includes('api')) platforms.push('API');
  
  return platforms;
}

function detectMobileApp(text) {
  return text.includes('mobile') || text.includes('ios') || text.includes('android') || text.includes('app store');
}

function generateTags(text, topics) {
  const tags = [];
  
  // Add topic names as tags
  topics.forEach(topic => {
    tags.push(topic.node.name);
  });
  
  // Add common tags
  if (text.includes('ai') || text.includes('artificial intelligence')) tags.push('AI');
  if (text.includes('automation')) tags.push('Automation');
  if (text.includes('no-code')) tags.push('No-Code');
  if (text.includes('api')) tags.push('API');
  if (text.includes('free')) tags.push('Free');
  if (text.includes('open source')) tags.push('Open Source');
  
  return [...new Set(tags)];
}

function calculateUpvoteVelocity(votes, createdAt) {
  const hoursLive = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60);
  return hoursLive > 0 ? parseFloat((votes / hoursLive).toFixed(2)) : 0;
}

async function storeStreamlinedData(products) {
  try {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
    
    const batchSize = 30;
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      
      const { error } = await supabase
        .from('ph_posts')
        .upsert(batch, { onConflict: 'id', ignoreDuplicates: false });
      
      if (error) {
        console.error(`Batch ${Math.floor(i / batchSize) + 1} error:`, error);
      }
      
      await sleep(1000);
    }
  } catch (error) {
    console.error('Storage error:', error);
    throw error;
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
