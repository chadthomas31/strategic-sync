import fetch from 'node-fetch';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Load environment variables
dotenv.config();

async function findServerPort(): Promise<number> {
  const ports = [3000, 3001, 3002];
  for (const port of ports) {
    try {
      const response = await fetch(`chad@netninja:~/projects/strategic-sync$    ls -la data/
total 56
drwxr-xr-x  2 chad chad  4096 Jul  2 21:23  .
drwxr-xr-x 17 chad chad  4096 Jul  2 21:13  ..
-rw-r--r--  1 chad chad     0 Jul  2 19:58 'Icon'$'\r'
-rw-r--r--  1 chad chad 31963 Jul  9 01:30  blog-cache.json
-rw-r--r--  1 chad chad 15092 Jul  2 19:58  blog-posts.json
chad@netninja:~/projects/strategic-sync$ curl -X POST "http://localhost:3000/api/blog/update?token=strategic-sync-cron-2025"
<!DOCTYPE html><html lang="en" data-critters-container><head><style data-next-hide-fouc="true">body{display:none}</style><noscript data-next-hide-fouc="true"><style>body{display:block}</style></noscript><meta charset="utf-8"><meta name="viewport" content="width=device-width"><meta name="next-head-count" content="2"><meta charset="utf-8"><meta name="robots" content="index, follow"><meta name="googlebot" content="index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1"><link rel="icon" href="/favicon.ico"><link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"><link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"><link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"><link rel="manifest" href="/site.webmanifest"><meta name="theme-color" content="#0066cc"><meta name="msapplication-TileColor" content="#0066cc"><script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"Strategic Sync","description":"AI consulting and implementation services for business transformation","url":"https://strategicsync.com","logo":"https://strategicsync.com/images/logo.png","contactPoint":{"@type":"ContactPoint","telephone":"+1-949-529-2424","contactType":"Customer Support","availableLanguage":"English","areaServed":"US"},"address":{"@type":"PostalAddress","addressLocality":"San Juan Capistrano","addressRegion":"California","addressCountry":"US"},"sameAs":["https://www.linkedin.com/company/strategic-sync","https://twitter.com/strategicsync","https://www.facebook.com/strategicsync"],"service":[{"@type":"Service","name":"AI Strategy Consulting","description":"Comprehensive AI strategy development and planning services","provider":{"@type":"Organization","name":"Strategic Sync"}},{"@type":"Service","name":"AI Implementation","description":"End-to-end AI solution implementation and integration services","provider":{"@type":"Organization","name":"Strategic Sync"}},{"@type":"Service","name":"AI Optimization","description":"AI system optimization and performance enhancement services","provider":{"@type":"Organization","name":"Strategic Sync"}}]}</script><script type="application/ld+json">{"@context":"https://schema.org","@type":"ProfessionalService","name":"Strategic Sync","description":"Expert AI consulting and implementation services for business transformation","url":"https://strategicsync.com","telephone":"+1-949-529-2424","email":"info@strategicsync.com","priceRange":"$$","areaServed":{"@type":"Country","name":"United States"},"serviceType":["AI Consulting","AI Implementation","Business Intelligence","Machine Learning Services","AI Strategy Development"],"address":{"@type":"PostalAddress","addressLocality":"San Juan Capistrano","addressRegion":"California","addressCountry":"US"},"geo":{"@type":"GeoCoordinates","latitude":"33.5017","longitude":"-117.6628"}}</script><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous"><meta name="author" content="Strategic Sync"><meta name="publisher" content="Strategic Sync"><meta name="copyright" content="Strategic Sync"><meta name="language" content="English"><meta name="revisit-after" content="7 days"><meta name="distribution" content="Global"><meta name="rating" content="General"><link rel="dns-prefetch" href="//www.google-analytics.com"><link rel="dns-prefetch" href="//fonts.googleapis.com"><meta http-equiv="X-Content-Type-Options" content="nosniff"><meta http-equiv="X-Frame-Options" content="DENY"><meta http-equiv="X-XSS-Protection" content="1; mode=block"><script defer nomodule src="/_next/static/chunks/polyfills.js"></script><script src="/_next/static/chunks/webpack.js" defer></script><script src="/_next/static/chunks/main.js" defer></script><script src="/_next/static/chunks/pages/_app.js" defer></script><script src="/_next/static/chunks/pages/_error.js" defer></script><script src="/_next/static/development/_buildManifest.js" defer></script><script src="/_next/static/development/_ssgManifest.js" defer></script><noscript data-n-css></noscript><noscript id="__next_css__DO_NOT_USE__"></noscript></head><body class="antialiased"><div id="__next"></div><script src="/_next/static/chunks/react-refresh.js"></script><script id="__NEXT_DATA__" type="application/json">{"props":{"pageProps":{"statusCode":500}},"page":"/_error","query":{"token":"strategic-sync-cron-2025"},"buildId":"development","isFallback":false,"err":{"name":"Error","source":"server","message":"The OPENAI_API_KEY environment variable is missing or empty; either provide it, or instantiate the OpenAI client with an apiKey option, like new OpenAI({ apiKey: 'My API Key' }).","stack":"Error: The OPENAI_API_KEY environment variable is missing or empty; either provide it, or instantiate the OpenAI client with an apiKey option, like new OpenAI({ apiKey: 'My API Key' }).\n    at new OpenAI (file:///home/chad/projects/strategic-sync/node_modules/openai/index.mjs:48:19)\n    at eval (webpack-internal:///(api)/./utils/openAI.ts:12:16)"},"gip":true,"scriptLoader":[]}</script></body></html>chad@netninja:~/projects/strategic-sync$ http://localhost:${port}/api/health`);
      if (response.ok) {
        return port;
      }
    } catch (error) {
      console.log(`Port ${port} not available`);
    }
  }
  throw new Error('Could not find running Next.js server on ports 3000-3002');
}

async function testBlogUpdate() {
  console.log('Starting blog update test...');
  
  // Verify environment variables
  const token = process.env.CRON_SECRET_TOKEN;
  if (!token) {
    throw new Error('CRON_SECRET_TOKEN not found in environment variables');
  }
  console.log('Using CRON_SECRET_TOKEN:', token);

  // Clear existing blog posts
  const blogPostsPath = path.join(process.cwd(), 'data', 'blog-posts.json');
  fs.writeFileSync(blogPostsPath, '[]');
  console.log('Cleared existing blog posts');

  try {
    // Find the active server port
    console.log('Looking for active server...');
    const port = await findServerPort();
    console.log(`Found server running on port ${port}`);

    // Make the blog update request
    console.log('Sending blog update request...');
    const response = await fetch(`http://localhost:${port}/api/blog/update?token=${token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Blog update failed: ${error}`);
    }

    const result = await response.json();
    console.log('\nBlog update response:', JSON.stringify(result, null, 2));

    // Verify the blog posts were created
    const posts = JSON.parse(fs.readFileSync(blogPostsPath, 'utf8'));
    console.log(`\nVerification: ${posts.length} posts in blog-posts.json`);
    
    if (posts.length > 0) {
      console.log('\nLatest post:', {
        title: posts[0].title,
        date: posts[0].date,
        category: posts[0].category,
        imageUrl: posts[0].imageUrl
      });
    }

  } catch (error) {
    console.error('\nError:', error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }
}

testBlogUpdate().catch(console.error); 