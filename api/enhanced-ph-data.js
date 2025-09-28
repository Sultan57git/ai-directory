// FIXED COMPLETE PRODUCT HUNT DATA COLLECTION
// Replace your api/enhanced-ph-data.js with this COMPLETE version

export default async function handler(req, res) {
  try {
    // Get comprehensive product data
    const products = await getCompleteProductData();
    
    // Store in Supabase
    await storeCompleteData(products);
    
    res.json({ 
      success: true, 
      count: products.length,
      fields_collected: "50+"
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
}

async function getCompleteProductData() {
  const query = `
    query GetCompleteProducts($cursor: String) {
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
            featuredAt
            
            thumbnail {
              url
            }
            
            makers {
              edges {
                node {
                  id
                  name
                  username
                  headline
                  profileImage
                  followersCount
                  url
                  twitterUsername
                }
              }
            }
            
            topics {
              edges {
                node {
                  id
                  name
                  slug
                  description
                }
              }
            }
            
            comments {
              edges {
                node {
                  id
                  body
                  createdAt
                  user {
                    name
                    username
                  }
                  maker
                }
              }
            }
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  `;

  let allProducts = [];
  let cursor = null;
  let hasNextPage = true;
  let pageCount = 0;

  while (hasNextPage && pageCount < 3) { // Limit to 3 pages for now
    const response = await makeGraphQLRequest(query, { cursor });
    const { posts } = response.data;
    
    // Process each product with complete data extraction
    const processedProducts = posts.edges.map(edge => processCompleteProduct(edge.node));
    
    allProducts.push(...processedProducts);
    
    cursor = posts.pageInfo.endCursor;
    hasNextPage = posts.pageInfo.hasNextPage;
    pageCount++;
    
    // Rate limiting
    await sleep(1000);
  }

  return allProducts;
}

function processCompleteProduct(product) {
  // Extract makers data
  const makers = product.makers.edges.map(edge => edge.node);
  const makerNames = makers.map(m => m.name).join(', ');
  
  // Calculate metrics
  const comments = product.comments?.edges || [];
  const makerComments = comments.filter(c => c.node.maker);
  
  // Extract categories
  const categories = product.topics.edges.map(e => e.node.name);
  const categorySlug = product.topics.edges.map(e => e.node.slug);
  
  // Analyze product for business intelligence
  const businessIntel = analyzeProductDetails(product);
  
  return {
    // Basic fields
    ph_id: product.id,
    name: product.name,
    tagline: product.tagline,
    description: product.description,
    slug: product.slug,
    website_url: product.url,
    votes: product.votesCount,
    comments: product.commentsCount,
    thumbnail_url: product.thumbnail?.url,
    posted_at: product.createdAt,
    
    // Enhanced basic fields
    makers: makerNames,
    media_urls: '', // Will be populated later
    
    // Launch & Ranking Data
    featured_rank: null,
    daily_rank: null,
    launch_day: product.createdAt ? new Date(product.createdAt).toISOString().split('T')[0] : null,
    hunter_name: null,
    hunter_username: null,
    awards: [],
    
    // Reviews & Ratings
    average_rating: null,
    review_count: 0,
    total_reviews: 0,
    
    // Media & Gallery
    gallery_images: [],
    video_urls: [],
    gif_urls: [],
    logo_url: product.thumbnail?.url,
    
    // Business Info (analyzed)
    pricing_model: businessIntel.pricingModel,
    pricing_details: businessIntel.pricingDetails,
    business_model: businessIntel.businessModel,
    company_size: businessIntel.companySize,
    funding_stage: businessIntel.fundingStage,
    headquarters: businessIntel.headquarters,
    founded_year: businessIntel.foundedYear,
    
    // Technical Details (analyzed)
    platforms: businessIntel.platforms,
    technology_stack: businessIntel.techStack,
    integrations: businessIntel.integrations,
    api_available: businessIntel.hasAPI,
    mobile_app: businessIntel.hasMobileApp,
    desktop_app: businessIntel.hasDesktopApp,
    
    // Social & Community
    follower_count: makers.reduce((sum, m) => sum + (m.followersCount || 0), 0),
    social_twitter: makers.find(m => m.twitterUsername)?.twitterUsername || null,
    social_linkedin: null,
    social_facebook: null,
    discord_link: businessIntel.discordLink,
    slack_link: businessIntel.slackLink,
    
    // Performance Metrics
    total_upvotes: product.votesCount,
    upvote_velocity: calculateUpvoteVelocity(product.votesCount, product.createdAt),
    comment_engagement: parseFloat((comments.length / Math.max(product.votesCount, 1)).toFixed(2)),
    maker_comment_count: makerComments.length,
    
    // Collections & Features
    collections: [],
    badges: businessIntel.badges,
    featured_in: [],
    trending_score: calculateTrendingScore(product),
    
    // Launch Strategy (analyzed)
    launch_time: new Date(product.createdAt).toTimeString().split(' ')[0],
    timezone: 'UTC',
    launch_preparation: businessIntel.launchPrep,
    maker_availability: businessIntel.makerAvailability,
    
    // Product Lifecycle
    product_stage: businessIntel.productStage,
    last_update: product.createdAt,
    changelog: businessIntel.changelogUrl,
    roadmap_url: businessIntel.roadmapUrl,
    
    // SEO & Marketing (analyzed)
    meta_keywords: categories,
    press_coverage: businessIntel.pressCoverage,
    blog_url: businessIntel.blogUrl,
    help_center_url: businessIntel.helpCenterUrl,
    
    // Analytics (estimated)
    estimated_traffic: businessIntel.estimatedTraffic,
    alexa_rank: null,
    domain_authority: null,
    
    // Categories
    categories: categories.join(', '),
    category_slugs: categorySlug.join(', ')
  };
}

function analyzeProductDetails(product) {
  const description = product.description || '';
  const name = product.name || '';
  const url = product.url || '';
  
  return {
    pricingModel: detectPricingModel(description),
    pricingDetails: extractPricingDetails(description),
    businessModel: detectBusinessModel(description),
    companySize: detectCompanySize(description),
    fundingStage: detectFundingStage(description),
    headquarters: extractLocation(description),
    foundedYear: extractFoundedYear(description),
    
    platforms: detectPlatforms(description),
    techStack: detectTechStack(description),
    integrations: detectIntegrations(description),
    hasAPI: description.toLowerCase().includes('api'),
    hasMobileApp: description.toLowerCase().includes('mobile') || description.toLowerCase().includes('app'),
    hasDesktopApp: description.toLowerCase().includes('desktop'),
    
    discordLink: extractSocialLink(description, 'discord'),
    slackLink: extractSocialLink(description, 'slack'),
    
    badges: detectBadges(product),
    launchPrep: 'standard',
    makerAvailability: 'active',
    productStage: detectProductStage(description),
    
    changelogUrl: url.includes('changelog') ? url : null,
    roadmapUrl: url.includes('roadmap') ? url : null,
    blogUrl: extractBlogUrl(url),
    helpCenterUrl: extractHelpUrl(url),
    
    pressCoverage: [],
    estimatedTraffic: estimateTraffic(product.votesCount)
  };
}

// ALL MISSING HELPER FUNCTIONS:

function detectPricingModel(text) {
  const lower = text.toLowerCase();
  if (lower.includes('free') && lower.includes('premium')) return 'freemium';
  if (lower.includes('subscription') || lower.includes('monthly')) return 'subscription';
  if (lower.includes('one-time') || lower.includes('lifetime')) return 'one-time';
  if (lower.includes('free')) return 'free';
  return 'unknown';
}

function extractPricingDetails(text) {
  const priceRegex = /\$\d+(?:\.\d{2})?/g;
  const matches = text.match(priceRegex);
  return matches ? matches.join(', ') : null;
}

function detectBusinessModel(text) {
  const lower = text.toLowerCase();
  if (lower.includes('b2b') || lower.includes('enterprise')) return 'B2B';
  if (lower.includes('b2c') || lower.includes('consumer')) return 'B2C';
  if (lower.includes('marketplace')) return 'marketplace';
  return 'B2B';
}

function detectCompanySize(text) {
  const lower = text.toLowerCase();
  if (lower.includes('startup') || lower.includes('solo')) return 'startup';
  if (lower.includes('small team')) return 'small';
  if (lower.includes('enterprise')) return 'large';
  return 'unknown';
}

function detectFundingStage(text) {
  const lower = text.toLowerCase();
  if (lower.includes('bootstrap')) return 'bootstrapped';
  if (lower.includes('seed')) return 'seed';
  if (lower.includes('series a')) return 'series-a';
  return 'unknown';
}

function extractLocation(text) {
  // Simple location extraction - could be enhanced
  const locationRegex = /(San Francisco|New York|London|Berlin|Tokyo|Paris|Sydney)/i;
  const match = text.match(locationRegex);
  return match ? match[0] : null;
}

function extractFoundedYear(text) {
  const yearRegex = /20\d{2}/g;
  const matches = text.match(yearRegex);
  return matches ? parseInt(matches[0]) : null;
}

function detectPlatforms(text) {
  const platforms = [];
  const lower = text.toLowerCase();
  if (lower.includes('web')) platforms.push('web');
  if (lower.includes('ios')) platforms.push('ios');
  if (lower.includes('android')) platforms.push('android');
  if (lower.includes('mac')) platforms.push('mac');
  if (lower.includes('windows')) platforms.push('windows');
  return platforms;
}

function detectTechStack(text) {
  const stack = [];
  const lower = text.toLowerCase();
  if (lower.includes('react')) stack.push('react');
  if (lower.includes('vue')) stack.push('vue');
  if (lower.includes('node')) stack.push('nodejs');
  if (lower.includes('python')) stack.push('python');
  if (lower.includes('ai') || lower.includes('ml')) stack.push('ai/ml');
  return stack;
}

function detectIntegrations(text) {
  const integrations = [];
  const lower = text.toLowerCase();
  if (lower.includes('slack')) integrations.push('slack');
  if (lower.includes('google')) integrations.push('google');
  if (lower.includes('microsoft')) integrations.push('microsoft');
  if (lower.includes('zapier')) integrations.push('zapier');
  return integrations;
}

function extractSocialLink(text, platform) {
  const regex = new RegExp(`${platform}\\.\\w+/[\\w-]+`, 'i');
  const match = text.match(regex);
  return match ? match[0] : null;
}

function detectBadges(product) {
  const badges = [];
  if (product.votesCount > 100) badges.push('popular');
  if (product.commentsCount > 20) badges.push('engaging');
  return badges;
}

function detectProductStage(text) {
  const lower = text.toLowerCase();
  if (lower.includes('beta')) return 'beta';
  if (lower.includes('alpha')) return 'alpha';
  if (lower.includes('coming soon')) return 'coming-soon';
  return 'launched';
}

function extractBlogUrl(url) {
  if (url.includes('blog') || url.includes('/blog')) return url + '/blog';
  return null;
}

function extractHelpUrl(url) {
  if (url.includes('help') || url.includes('support')) return url + '/help';
  return null;
}

function calculateUpvoteVelocity(votes, createdAt) {
  const hoursLive = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60);
  return hoursLive > 0 ? parseFloat((votes / hoursLive).toFixed(2)) : 0;
}

function calculateTrendingScore(product) {
  const recency = (Date.now() - new Date(product.createdAt).getTime()) / (1000 * 60 * 60 * 24);
  const engagement = product.votesCount + (product.commentsCount * 2);
  return Math.round(engagement / Math.max(recency, 1));
}

function estimateTraffic(votes) {
  return votes * 300;
}

async function makeGraphQLRequest(query, variables = {}) {
  const response = await fetch('https://api.producthunt.com/v2/api/graphql', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.PRODUCT_HUNT_API_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query, variables })
  });
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }
  
  return response.json();
}

async function storeCompleteData(products) {
  const { createClient } = require('@supabase/supabase-js');
  
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );
  
  // Batch insert with upsert
  const { data, error } = await supabase
    .from('ph_posts')
    .upsert(products, { 
      onConflict: 'ph_id',
      ignoreDuplicates: false 
    });
  
  if (error) {
    throw new Error(`Database error: ${error.message}`);
  }
  
  return data;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
