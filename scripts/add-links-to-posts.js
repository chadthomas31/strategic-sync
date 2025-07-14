const fs = require('fs').promises;
const path = require('path');

function normalizeTitle(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove special characters
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

async function addLinksToPosts() {
  try {
    // Read the current blog posts
    const blogPostsPath = path.join(process.cwd(), 'data', 'blog-posts.json');
    const blogPostsData = await fs.readFile(blogPostsPath, 'utf8');
    const blogPosts = JSON.parse(blogPostsData);

    // Read the cache data
    const cachePath = path.join(process.cwd(), 'data', 'blog-cache.json');
    const cacheData = await fs.readFile(cachePath, 'utf8');
    const cache = JSON.parse(cacheData);

    // Create a map of normalized title to link from cache
    const titleToLinkMap = new Map();
    cache.posts.forEach(post => {
      if (post.link && post.title) {
        const normalizedTitle = normalizeTitle(post.title);
        titleToLinkMap.set(normalizedTitle, post.link);
      }
    });

    console.log('Cache posts with links:', titleToLinkMap.size);
    console.log('Blog posts to check:', blogPosts.length);

    // Add links to blog posts where possible
    let updatedCount = 0;
    const updatedPosts = blogPosts.map(post => {
      const normalizedTitle = normalizeTitle(post.title);
      const link = titleToLinkMap.get(normalizedTitle);
      
      if (link && !post.link) {
        console.log(`\n✅ Adding link to: ${post.title}`);
        console.log(`   Link: ${link}`);
        updatedCount++;
        return { ...post, link };
      } else if (post.link) {
        console.log(`\nℹ️  Already has link: ${post.title}`);
        console.log(`   Link: ${post.link}`);
      } else {
        console.log(`\n❌ No link found for: ${post.title}`);
      }
      
      return post;
    });

    // Save the updated blog posts
    await fs.writeFile(blogPostsPath, JSON.stringify(updatedPosts, null, 2));
    
    console.log(`\n📊 Summary:`);
    console.log(`   Updated ${updatedCount} posts with links`);
    console.log(`   Total posts: ${updatedPosts.length}`);
    
  } catch (error) {
    console.error('Error updating blog posts:', error);
  }
}

addLinksToPosts(); 