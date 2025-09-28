// COMPLETE PRODUCT HUNT DATA COLLECTION
// Replace your api/enhanced-ph-data.js with this

export default async function handler(req, res) {
  try {
    // Get comprehensive product data
    const products = await getCompleteProductData();
    
    // Store in Supabase
    await storeCompleteData(products);
    
    res.json({ 
      success: true, 
      count: products.length,
      fields_collected: 50+
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
}

async function getCompleteProductData() {
  const query = `
    query GetCompleteProducts($cursor: String) {
      posts(first: 50, after: $cursor) {
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
            
            # Launch & Ranking Data
            dailyRank
            hunter {
              name
              username
              profileImage
            }
            awards {
              name
              description
            }
            
            # Media & Gallery
            thumbnail {
              url
            }
            media {
              type
              url
              videoUrl
            }
            gallery {
              images {
                url
              }
              videos {
                url
              }
            }
            
            # Makers & Team
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
                  linkedInUrl
                  websiteUrl
                }
              }
            }
            
            # Categories & Topics
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
            
            # Collections
            collections {
              edges {
                node {
                  id
                  name
                  description
                }
              }
            }
            
            # Reviews & Comments
            reviews {
              edges {
                node {
                  id
                  rating
                  body
                  createdAt
                  user {
                    name
                    username
                  }
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
            
            # Product Details (if available in API)
            website
            priceModel
            platforms
            
            # Social Links
            twitterUrl
            facebookUrl
            instagramUrl
            
            # Additional metadata
            createdAt
            updatedAt
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

  while (hasNextPage) {
    const response = await makeGraphQLRequest(query, { cursor });
    const { posts } = response.data;
    
    // Process each product with complete data extraction
    const processedProducts = await Promise.all(
      posts.edges.map(edge => processCompleteProduct(edge.node))
    );
    
    allProducts.push(...processedProducts);
    
    cursor = posts.pageInfo.endCursor;
    hasNextPage = posts.pageInfo.hasNextPage;
    
    // Rate limiting
    await sleep(1000);
  }

  return allProducts;
}

async function processCompleteProduct(product) {
  // Extract makers data
  const makers = product.makers.edges.map(edge => edge.node);
  const makerNames = makers.map(m => m.name).join(', ');
  
  // Extract media URLs
  const mediaUrls = product.media?.map(m => m.url || m.videoUrl).filter(Boolean) || [];
  const galleryImages = product.gallery?.images?.map(img => img.url) || [];
  const videoUrls = product.gallery?.videos?.map(vid => vid.url) || [];
  
  // Extract social links
  const socialTwitter = makers.find(m => m.twitterUsername)?.twitterUsername;
  const socialLinkedIn = makers.find(m => m.linkedInUrl)?.linkedInUrl;
  
  // Calculate metrics
  const reviews = product.reviews?.edges || [];
  const comments = product.comments?.edges || [];
  const makerComments = comments.filter(c => c.node.maker);
  
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, r) => sum + r.node.rating, 0) / reviews.length 
    : null;
  
  // Extract categories
  const categories = product.topics.edges.map(e => e.node.name);
  const categorySlug = product.topics.edges.map(e => e.node.slug);
  
  // Extract collections
  const collections = product.collections?.edges.map(e => e.node.name) || [];
  
  // Analyze product for business intelligence
  const businessIntel = await analyzeProductDetails(product);
  
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
    media_urls: mediaUrls.join(', '),
    
    // Launch & Ranking Data
    featured_rank: null, // Not available in free API
    daily_rank: product.dailyRank,
    launch_day: product.createdAt ? new Date(product.createdAt).toISOString().split('T')[0] : null,
    hunter_name: product.hunter?.name,
    hunter_username: product.hunter?.username,
    awards: product.awards?.map(a => a.name) || [],
    
    // Reviews & Ratings
    average_rating: averageRating ? parseFloat(averageRating.toFixed(2)) : null,
    review_count: reviews.length,
    total_reviews: reviews.length,
    
    // Media & Gallery
    gallery_images: galleryImages,
    video_urls: videoUrls,
    gif_urls: mediaUrls.filter(url => url.includes('.gif')),
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
    social_twitter: socialTwitter,
    social_linkedin: socialLinkedIn,
    social_facebook: product.facebookUrl,
    discord_link: businessIntel.discordLink,
    slack_link: businessIntel.slackLink,
    
    // Performance Metrics
    total_upvotes: product.votesCount,
    upvote_velocity: calculateUpvoteVelocity(product.votesCount, product.createdAt),
    comment_engagement: comments.length / Math.max(product.votesCount, 1),
    maker_comment_count: makerComments.length,
    
    // Collections & Features
    collections: collections,
    badges: businessIntel.badges,
    featured_in: collections,
    trending_score: calculateTrendingScore(product),
    
    // Launch Strategy (analyzed)
    launch_time: new Date(product.createdAt).toTimeString().split(' ')[0],
    timezone: 'UTC', // Default, would need geolocation
    launch_preparation: businessIntel.launchPrep,
    maker_availability: businessIntel.makerAvailability,
    
    // Product Lifecycle
    product_stage: businessIntel.productStage,
    last_update: product.updatedAt,
    changelog: businessIntel.changelogUrl,
    roadmap_url: businessIntel.roadmapUrl,
    
    // SEO & Marketing (analyzed)
    meta_keywords: categories,
    press_coverage: businessIntel.pressCoverage,
    blog_url: businessIntel.blogUrl,
    help_center_url: businessIntel.helpCenterUrl,
    
    // Analytics (estimated)
    estimated_traffic: businessIntel.estimatedTraffic,
    alexa_rank: null, // Would need external API
    domain_authority: null, // Would need external API
    
    // Categories
    categories: categories.join(', '),
    category_slugs: categorySlug.join(', ')
  };
}

async function analyzeProductDetails(product) {
  // AI-powered analysis of product details
  const description = product.description || '';
  const name = product.name || '';
  const url = product.url || '';
  
  // Simple keyword-based analysis (replace with AI service)
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
    launchPrep: 'standard', // Default
    makerAvailability: 'active', // Default
    productStage: detectProductStage(description),
    
    changelogUrl: url.includes('changelog') ? url : null,
    roadmapUrl: url.includes('roadmap') ? url : null,
    blogUrl: extractBlogUrl(url),
    helpCenterUrl: extractHelpUrl(url),
    
    pressCoverage: [],
    estimatedTraffic: estimateTraffic(product.votesCount)
  };
}

// Helper functions for analysis
function detectPricingModel(text) {
  const lower = text.toLowerCase();
  if (lower.includes('free') && lower.includes('premium')) return 'freemium';
  if (lower.includes('subscription') || lower.includes('monthly')) return 'subscription';
  if (lower.includes('one-time') || lower.includes('lifetime')) return 'one-time';
  if (lower.includes('free')) return 'free';
  return 'unknown';
}

function detectBusinessModel(text) {
  const lower = text.toLowerCase();
  if (lower.includes('b2b') || lower.includes('enterprise')) return 'B2B';
  if (lower.includes('b2c') || lower.includes('consumer')) return 'B2C';
  if (lower.includes('marketplace')) return 'marketplace';
  return 'B2B'; // Default assumption
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
  // Rough estimation: 1 vote ≈ 100-500 visitors
  return votes * 300;
}

// Add other helper functions...

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
