// Replace your current Vercel API file with this
export default async function handler(req, res) {
  const response = await fetch('https://api.producthunt.com/v2/api/graphql', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.PRODUCT_HUNT_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: `
        query {
          posts(first: 100) {
            edges {
              node {
                id
                name
                tagline
                description
                url
                votesCount
                commentsCount
                createdAt
                makers {
                  edges {
                    node {
                      name
                      username
                      profileImage
                    }
                  }
                }
                media {
                  type
                  url
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

  const data = await response.json();
  
  // Save to Supabase with enhanced data
  const products = data.data.posts.edges.map(edge => ({
    ph_id: edge.node.id,
    name: edge.node.name,
    tagline: edge.node.tagline,
    description: edge.node.description,
    slug: edge.node.slug,
    website_url: edge.node.url,
    votes: edge.node.votesCount,
    comments: edge.node.commentsCount,
    posted_at: edge.node.createdAt,
    makers: edge.node.makers.edges.map(m => m.node.name).join(', '),
    media_urls: edge.node.media.map(m => m.url).join(', '),
    categories: edge.node.topics.edges.map(t => t.node.name).join(', '),
    category_slugs: edge.node.topics.edges.map(t => t.node.slug).join(', ')
  }));

  // Insert to Supabase here
  
  res.json({ success: true, count: products.length });
}
