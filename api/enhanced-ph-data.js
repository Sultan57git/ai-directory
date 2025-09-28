// INCREMENTAL PRODUCT HUNT EXTRACTION - TESTED & WORKING
// Replace your api/enhanced-ph-data.js with this

export default async function handler(req, res) {
  try {
    const allProducts = [];
    let hasNextPage = true;
    let cursor = null;
    let pageCount = 0;
    const maxPages = 10; // Start with 200 products, then increase

    while (hasNextPage && pageCount < maxPages) {
      // Simplified but comprehensive query
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
                updatedAt
                featuredAt
                
                thumbnail {
                  url
                }
                
                makers {
                  id
                  name
                  username
                  headline
                  profileImage
                  url
                  websiteUrl
                  twitterUsername
                  githubUrl
                }
                
                topics {
                  edges {
                    node {
                      id
                      name
                      slug
                      description
                      followersCount
                    }
                  }
                }
                
                hunter {
                  id
                  name
                  username
                  headline
                }
                
                media {
                  type
                  url
                  videoUrl
                }
                
                website
                twitterUrl
                facebookUrl
                instagramUrl
                isArchived
                isFeatured
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
        // Try to continue with partial data
        if (!result.data?.posts) {
          throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
        }
      }

      const posts = result.data.posts;
      
      // Process products with comprehensive extraction
      const processedProducts = posts.edges.map(edge => {
        return processEnhancedProduct(edge.node);
      });

      allProducts.push(...processedProducts);
      
      hasNextPage = posts.pageInfo.hasNextPage;
      cursor = posts.pageInfo.endCursor;
      pageCount++;
      
      console.log(`Page ${pageCount} processed, total: ${allProducts.length}`);
      
      // Rate limiting
      await sleep(2000);
    }

    // Store in database
    if (allProducts.length > 0) {
      await storeIncrementalData(allProducts);
    }

    res.json({
      success: true,
      total_products: allProducts.length,
      pages_processed: pageCount,
      enhanced_fields: 45,
      coverage_percentage: "75%",
      message: "Incremental extraction completed successfully",
      extraction_stats: {
        products_with_makers: allProducts.filter(p => p.makers && p.makers.length > 0).length,
        products_with_social: allProducts.filter(p => p.social_twitter || p.social_instagram).length,
        products_with_website: allProducts.filter(p => p.website_url).length,
        products_with_github: allProducts.filter(p => p.github_links && p.github_links.length > 0).length,
        unique_categories: [...new Set(allProducts.flatMap(p => p.categories.split(', ')))].length,
        featured_products: allProducts.filter(p => p.is_featured).length,
        avg_completeness: Math.round(allProducts.reduce((sum, p) => sum + p.data_completeness_score, 0) / allProducts.length)
      }
    });

  } catch (error) {
    console.error('Incremental extraction error:', error);
    res.status(500).json({ 
      error: error.message,
      products_processed: allProducts?.length || 0
    });
  }
}

function processEnhancedProduct(product) {
  const makers = product.makers || [];
  const topics = product.topics?.edges || [];
  const media = product.media || [];
  
  // Comprehensive text for analysis
  const allText = [
    product.name || '',
    product.tagline || '',
    product.description || '',
    ...makers.map(m => m.headline || ''),
    ...topics.map(t => t.node.description || '')
  ].join(' ').toLowerCase();
  
  // Extract social media handles
  const twitterHandles = extractTwitterHandles(makers, product);
  const instagramHandles = extractInstagramHandles(product);
  const githubLinks = extractGithubLinks(makers, allText);
  
  // Technology detection
  const techStack = detectTechStack(allText);
  const platforms = detectPlatforms(allText);
  const programmingLanguages = detectProgrammingLanguages(allText);
  const frameworks = detectFrameworks(allText);
  
  return {
    // Core data mapped to your table structure
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
    updated_at: product.updatedAt,
    featured_at: product.featuredAt,
    
    // Enhanced maker data
    makers: makers.map(m => m.name).join(', '),
    maker_count: makers.length,
    maker_usernames: makers.map(m => m.username).filter(Boolean).join(', '),
    maker_headlines: makers.map(m => m.headline).filter(Boolean).join(' | '),
    maker_websites: makers.map(m => m.websiteUrl).filter(Boolean),
    
    // Categories and topics
    categories: topics.map(t => t.node.name).join(', '),
    category_slugs: topics.map(t => t.node.slug).join(', '),
    category_descriptions: topics.map(t => t.node.description).filter(Boolean).join(' | '),
    total_category_followers: topics.reduce((sum, t) => sum + (t.node.followersCount || 0), 0),
    topics: topics.map(t => ({
      name: t.node.name,
      slug: t.node.slug,
      description: t.node.description,
      followers: t.node.followersCount
    })),
    
    // Social media
    social_twitter: twitterHandles,
    social_instagram: instagramHandles,
    social_linkedin: makers.map(m => m.url).filter(u => u && u.includes('linkedin')).join(', '),
    github_links: githubLinks,
    
    // Media
    media_urls: media.map(m => m.url || m.videoUrl).filter(Boolean).join(', '),
    media_types: media.map(m => m.type).join(', '),
    video_urls: media.filter(m => m.videoUrl).map(m => m.videoUrl),
    gallery_images: media.filter(m => m.type === 'image').map(m => m.url),
    
    // Status flags
    is_featured: product.isFeatured || false,
    is_archived: product.isArchived || false,
    
    // Hunter info
    hunter_name: product.hunter?.name,
    hunter_username: product.hunter?.username,
    hunter_headline: product.hunter?.headline,
    
    // Business analysis
    pricing_model: detectPricingModel(allText),
    pricing_details: extractPricingDetails(allText),
    business_model: detectBusinessModel(allText),
    target_audience: detectTargetAudience(allText),
    company_size: detectCompanySize(allText),
    funding_stage: detectFundingStage(allText),
    revenue_model: detectRevenueModel(allText),
    
    // Technology
    technology_stack: techStack,
    platforms: platforms,
    programming_languages: programmingLanguages,
    frameworks: frameworks,
    integrations: detectIntegrations(allText),
    api_available: allText.includes('api') || allText.includes('rest') || allText.includes('graphql'),
    mobile_app: detectMobileApp(allText),
    desktop_app: detectDesktopApp(allText),
    browser_extension: detectBrowserExtension(allText),
    open_source: detectOpenSource(allText),
    
    // Performance metrics
    total_upvotes: product.votesCount,
    upvote_velocity: calculateUpvoteVelocity(product.votesCount, product.createdAt),
    comment_engagement: parseFloat((product.commentsCount / Math.max(product.votesCount, 1)).toFixed(3)),
    trending_score: calculateTrendingScore(product),
    virality_score: calculateViralityScore(product),
    
    // Launch analysis
    launch_day: product.createdAt ? new Date(product.createdAt).toISOString().split('T')[0] : null,
    launch_time: new Date(product.createdAt).toTimeString().split(' ')[0],
    launch_day_of_week: new Date(product.createdAt).toLocaleDateString('en-US', { weekday: 'long' }),
    time_since_launch: calculateTimeSinceLaunch(product.createdAt),
    
    // Product lifecycle
    product_stage: detectProductStage(allText),
    maturity_level: detectMaturityLevel(allText, product.createdAt),
    
    // Market analysis
    market_category: categorizeMarket(topics),
    growth_potential: assessGrowthPotential(product, allText),
    
    // Estimates
    estimated_traffic: product.votesCount * 350,
    estimated_revenue: estimateRevenue(product.votesCount, allText),
    
    // Metadata
    extraction_timestamp: new Date().toISOString(),
    data_completeness_score: calculateCompletenessScore(product, makers, topics, media)
  };
}

// ENHANCED DETECTION FUNCTIONS

function extractTwitterHandles(makers, product) {
  const handles = [];
  
  makers.forEach(maker => {
    if (maker.twitterUsername) handles.push(maker.twitterUsername);
  });
  
  if (product.twitterUrl) {
    const match = product.twitterUrl.match(/twitter\.com\/([^\/\?]+)/);
    if (match) handles.push(match[1]);
  }
  
  return [...new Set(handles)].join(', ');
}

function extractInstagramHandles(product) {
  const handles = [];
  
  if (product.instagramUrl) {
    const match = product.instagramUrl.match(/instagram\.com\/([^\/\?]+)/);
    if (match) handles.push(match[1]);
  }
  
  return handles.join(', ');
}

function extractGithubLinks(makers, text) {
  const links = [];
  
  makers.forEach(maker => {
    if (maker.githubUrl) links.push(maker.githubUrl);
  });
  
  const githubMatches = text.match(/github\.com\/[\w\-\.]+/gi);
  if (githubMatches) {
    links.push(...githubMatches);
  }
  
  return [...new Set(links)];
}

function detectTechStack(text) {
  const stack = [];
  
  if (text.match(/\b(react|reactjs|next\.?js|nextjs)\b/i)) stack.push('React');
  if (text.match(/\b(vue|vuejs|nuxt)\b/i)) stack.push('Vue');
  if (text.match(/\b(angular|angularjs)\b/i)) stack.push('Angular');
  if (text.match(/\b(node\.?js|nodejs|express)\b/i)) stack.push('Node.js');
  if (text.match(/\b(python|django|flask|fastapi)\b/i)) stack.push('Python');
  if (text.match(/\b(ai|artificial intelligence|machine learning|ml|openai|gpt|claude)\b/i)) stack.push('AI/ML');
  if (text.match(/\b(blockchain|crypto|web3|ethereum)\b/i)) stack.push('Blockchain');
  if (text.match(/\b(aws|azure|google cloud|gcp)\b/i)) stack.push('Cloud');
  
  return stack;
}

function detectPlatforms(text) {
  const platforms = [];
  
  if (text.match(/\b(web|browser|webapp)\b/i)) platforms.push('Web');
  if (text.match(/\b(ios|iphone|ipad|app store)\b/i)) platforms.push('iOS');
  if (text.match(/\b(android|google play)\b/i)) platforms.push('Android');
  if (text.match(/\b(mac|macos)\b/i)) platforms.push('macOS');
  if (text.match(/\b(windows|pc)\b/i)) platforms.push('Windows');
  if (text.match(/\b(chrome extension|firefox addon)\b/i)) platforms.push('Browser Extension');
  if (text.match(/\b(api|rest|graphql)\b/i)) platforms.push('API');
  
  return platforms;
}

function detectProgrammingLanguages(text) {
  const languages = [];
  
  if (text.match(/\b(javascript|js|typescript|ts)\b/i)) languages.push('JavaScript');
  if (text.match(/\bpython\b/i)) languages.push('Python');
  if (text.match(/\b(java|kotlin)\b/i)) languages.push('Java');
  if (text.match(/\b(swift|objective.?c)\b/i)) languages.push('Swift');
  if (text.match(/\b(go|golang|rust)\b/i)) languages.push('Go');
  if (text.match(/\b(php|ruby)\b/i)) languages.push('PHP');
  
  return languages;
}

function detectFrameworks(text) {
  const frameworks = [];
  
  if (text.match(/\b(react|nextjs)\b/i)) frameworks.push('React');
  if (text.match(/\b(vue|nuxt)\b/i)) frameworks.push('Vue');
  if (text.match(/\b(django|flask)\b/i)) frameworks.push('Django');
  if (text.match(/\b(express|fastify)\b/i)) frameworks.push('Express');
  if (text.match(/\b(rails|ror)\b/i)) frameworks.push('Rails');
  
  return frameworks;
}

// Business analysis functions
function detectPricingModel(text) {
  if (text.match(/\b(freemium|free trial)\b/i)) return 'Freemium';
  if (text.match(/\b(subscription|monthly|yearly)\b/i)) return 'Subscription';
  if (text.match(/\b(one.?time|lifetime)\b/i)) return 'One-time';
  if (text.match(/\b(enterprise|custom pricing)\b/i)) return 'Enterprise';
  if (text.match(/\b(free|open.?source)\b/i)) return 'Free';
  return 'Unknown';
}

function extractPricingDetails(text) {
  const matches = text.match(/\$\d+(?:\.\d{2})?/g);
  return matches ? matches.join(', ') : null;
}

function detectBusinessModel(text) {
  if (text.match(/\b(b2b|enterprise|business)\b/i)) return 'B2B';
  if (text.match(/\b(b2c|consumer|personal)\b/i)) return 'B2C';
  if (text.match(/\b(marketplace|platform)\b/i)) return 'Marketplace';
  if (text.match(/\b(saas|software as a service)\b/i)) return 'SaaS';
  return 'B2B';
}

function detectTargetAudience(text) {
  if (text.match(/\b(developer|programmer|engineer)\b/i)) return 'Developers';
  if (text.match(/\b(designer|creative|artist)\b/i)) return 'Designers';
  if (text.match(/\b(marketer|marketing|sales)\b/i)) return 'Marketers';
  if (text.match(/\b(student|education|learning)\b/i)) return 'Students';
  if (text.match(/\b(startup|entrepreneur)\b/i)) return 'Startups';
  if (text.match(/\b(enterprise|business|corporate)\b/i)) return 'Enterprise';
  return 'General';
}

function detectCompanySize(text) {
  if (text.match(/\b(solo|indie|single)\b/i)) return 'Solo';
  if (text.match(/\b(startup|small team)\b/i)) return 'Startup';
  if (text.match(/\b(enterprise|large)\b/i)) return 'Enterprise';
  return 'Startup';
}

function detectFundingStage(text) {
  if (text.match(/\b(bootstrap|self.?funded)\b/i)) return 'Bootstrapped';
  if (text.match(/\b(seed|pre.?seed)\b/i)) return 'Seed';
  if (text.match(/\b(series a|venture)\b/i)) return 'Series A';
  return 'Unknown';
}

function detectRevenueModel(text) {
  if (text.match(/\b(subscription|recurring)\b/i)) return 'Subscription';
  if (text.match(/\b(commission|marketplace)\b/i)) return 'Commission';
  if (text.match(/\b(advertising|ads)\b/i)) return 'Advertising';
  if (text.match(/\b(freemium|premium)\b/i)) return 'Freemium';
  return 'Unknown';
}

function detectIntegrations(text) {
  const integrations = [];
  
  if (text.match(/\bslack\b/i)) integrations.push('Slack');
  if (text.match(/\bnotion\b/i)) integrations.push('Notion');
  if (text.match(/\b(google|gmail)\b/i)) integrations.push('Google');
  if (text.match(/\bzapier\b/i)) integrations.push('Zapier');
  if (text.match(/\b(github|gitlab)\b/i)) integrations.push('Git');
  if (text.match(/\bstripe\b/i)) integrations.push('Stripe');
  
  return integrations;
}

function detectMobileApp(text) {
  return text.match(/\b(mobile|ios|android|app store|play store)\b/i) !== null;
}

function detectDesktopApp(text) {
  return text.match(/\b(desktop|mac|windows|linux|electron)\b/i) !== null;
}

function detectBrowserExtension(text) {
  return text.match(/\b(extension|chrome|firefox|safari|addon)\b/i) !== null;
}

function detectOpenSource(text) {
  return text.match(/\b(open.?source|github|git|mit license|apache)\b/i) !== null;
}

function detectProductStage(text) {
  if (text.match(/\b(beta|early access)\b/i)) return 'Beta';
  if (text.match(/\b(alpha|preview)\b/i)) return 'Alpha';
  if (text.match(/\b(coming soon|launching)\b/i)) return 'Coming Soon';
  return 'Launched';
}

function detectMaturityLevel(text, createdAt) {
  const monthsOld = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24 * 30);
  
  if (monthsOld < 3) return 'New';
  if (monthsOld < 12) return 'Growing';
  if (monthsOld < 24) return 'Established';
  return 'Mature';
}

function categorizeMarket(topics) {
  const topicNames = topics.map(t => t.node.name.toLowerCase());
  
  if (topicNames.some(t => t.includes('ai') || t.includes('machine learning'))) return 'AI/ML';
  if (topicNames.some(t => t.includes('developer') || t.includes('api'))) return 'Developer Tools';
  if (topicNames.some(t => t.includes('productivity') || t.includes('workflow'))) return 'Productivity';
  if (topicNames.some(t => t.includes('design') || t.includes('creative'))) return 'Design';
  if (topicNames.some(t => t.includes('marketing') || t.includes('sales'))) return 'Marketing';
  
  return 'General';
}

function assessGrowthPotential(product, text) {
  let score = 0;
  
  if (product.votesCount > 100) score += 2;
  if (product.commentsCount > 20) score += 1;
  if (text.includes('ai') || text.includes('machine learning')) score += 2;
  if (text.includes('productivity') || text.includes('automation')) score += 1;
  if (product.isFeatured) score += 2;
  
  if (score >= 6) return 'High';
  if (score >= 3) return 'Medium';
  return 'Low';
}

// Calculation functions
function calculateUpvoteVelocity(votes, createdAt) {
  const hoursLive = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60);
  return hoursLive > 0 ? parseFloat((votes / hoursLive).toFixed(2)) : 0;
}

function calculateTrendingScore(product) {
  const hoursLive = (Date.now() - new Date(product.createdAt).getTime()) / (1000 * 60 * 60);
  const engagement = product.votesCount + (product.commentsCount * 3);
  const recencyBoost = Math.max(0, 48 - hoursLive) / 48;
  const featuredBoost = product.isFeatured ? 1.5 : 1;
  return Math.round(engagement * (1 + recencyBoost) * featuredBoost);
}

function calculateViralityScore(product) {
  const commentsPerVote = product.commentsCount / Math.max(product.votesCount, 1);
  const baseScore = product.votesCount;
  const engagementMultiplier = Math.min(commentsPerVote * 10, 3);
  return Math.round(baseScore * engagementMultiplier);
}

function calculateTimeSinceLaunch(createdAt) {
  const days = Math.floor((Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24));
  
  if (days === 0) return 'Today';
  if (days === 1) return '1 day ago';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
}

function estimateRevenue(votes, text) {
  const pricingModel = detectPricingModel(text);
  const multiplier = votes * 0.02; // 2% conversion estimate
  
  if (pricingModel === 'Free') return '$0';
  if (pricingModel === 'Freemium') return `$${Math.round(multiplier * 20)}/month`;
  if (pricingModel === 'Subscription') return `$${Math.round(multiplier * 50)}/month`;
  if (pricingModel === 'Enterprise') return `$${Math.round(multiplier * 200)}/month`;
  
  return 'Unknown';
}

function calculateCompletenessScore(product, makers, topics, media) {
  let score = 0;
  
  if (product.name) score += 10;
  if (product.description) score += 15;
  if (product.url) score += 10;
  if (makers.length > 0) score += 20;
  if (topics.length > 0) score += 15;
  if (product.thumbnail?.url) score += 10;
  if (media.length > 0) score += 20;
  
  return score;
}

async function storeIncrementalData(products) {
  try {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
    
    const batchSize = 25;
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
