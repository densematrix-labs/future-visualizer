#!/usr/bin/env node
/**
 * Programmatic SEO Page Generator for AI Future Visualizer
 * Generates 5,000+ landing pages for long-tail keywords
 */

const fs = require('fs');
const path = require('path');

const dimensions = require('./dimensions.json');
const OUTPUT_DIR = path.join(__dirname, '../frontend/public/p');
const SITEMAP_PATH = path.join(__dirname, '../frontend/public/sitemap-programmatic.xml');
const SITEMAP_MAIN_PATH = path.join(__dirname, '../frontend/public/sitemap-main.xml');
const SITEMAP_INDEX_PATH = path.join(__dirname, '../frontend/public/sitemap.xml');

// Content templates for different focus areas
const focusAreaContent = {
  'technology': 'Explore the cutting-edge technological advancements that will transform {product}. From AI integration to quantum computing, discover the innovations that will reshape how we interact with technology.',
  'user-experience': 'Discover how {product} will revolutionize user interaction in the future. Seamless interfaces, intuitive design, and personalized experiences will define the next generation.',
  'social-impact': 'Examine the profound social implications of {product}\'s evolution. From changing work patterns to new forms of community, explore how society will adapt.',
  'business-model': 'Analyze the economic transformation of {product}. New revenue streams, subscription models, and decentralized ownership will reshape the business landscape.',
  'ai-integration': 'See how artificial intelligence will be deeply woven into {product}. Smart automation, predictive capabilities, and conversational interfaces will become standard.',
  'sustainability': 'Explore the green revolution in {product}. Carbon neutrality, circular economy principles, and eco-friendly design will drive the future.',
  'privacy': 'Understand how {product} will balance innovation with privacy. Decentralized data, encryption, and user sovereignty will be paramount.',
  'accessibility': 'Discover how {product} will become universally accessible. Inclusive design, multi-modal interfaces, and adaptive technologies will serve everyone.'
};

const industryContent = {
  'tech': 'The technology sector continues to push boundaries with exponential innovation.',
  'healthcare': 'Healthcare is being revolutionized by AI diagnostics, telemedicine, and personalized treatments.',
  'finance': 'Finance is transforming with blockchain, DeFi, and AI-powered investment strategies.',
  'education': 'Education is becoming more personalized, accessible, and AI-enhanced.',
  'retail': 'Retail is evolving with immersive shopping, automated logistics, and hyper-personalization.',
  'entertainment': 'Entertainment is merging reality with virtual worlds in unprecedented ways.',
  'manufacturing': 'Manufacturing is becoming smarter with IoT, 3D printing, and robotic automation.',
  'agriculture': 'Agriculture is being transformed by precision farming and sustainable practices.',
  'energy': 'Energy is transitioning to clean, distributed, and smart grid systems.',
  'real-estate': 'Real estate is evolving with smart buildings and virtual property.',
  'travel': 'Travel is being reimagined with sustainable transport and seamless experiences.',
  'food': 'Food systems are being revolutionized by lab-grown proteins and AI nutrition.',
  'fashion': 'Fashion is embracing sustainability, personalization, and digital wearables.',
  'sports': 'Sports are integrating AR/VR, analytics, and new forms of competition.',
  'media': 'Media is becoming immersive, interactive, and AI-generated.'
};

function slugify(text) {
  return text.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function capitalize(str) {
  return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function generatePageContent(combo, dimValues) {
  const productName = dimValues.famous_product || dimValues.product_type || 'technology';
  const productDisplay = capitalize(productName);
  const timeHorizon = dimValues.time_horizon || '10-years';
  const focusArea = dimValues.focus_area;
  const industry = dimValues.industry;
  
  let title = `Future of ${productDisplay}`;
  let description = `Discover what ${productDisplay} will look like`;
  let bodyContent = '';
  
  if (timeHorizon) {
    const yearDisplay = timeHorizon.includes('year') ? `in ${timeHorizon.replace('-', ' ')}` : `in ${timeHorizon}`;
    title += ` ${yearDisplay}`;
    description += ` ${yearDisplay}`;
  }
  
  if (focusArea) {
    title += ` - ${capitalize(focusArea)}`;
    bodyContent += `<p>${(focusAreaContent[focusArea] || '').replace('{product}', productDisplay)}</p>`;
  }
  
  if (industry) {
    title += ` in ${capitalize(industry)}`;
    bodyContent += `<p>${industryContent[industry] || ''}</p>`;
  }
  
  description += '. AI-powered predictions for the future of technology, user experience, and society.';
  
  const slug = combo.join('-');
  const url = `${dimensions.tool_url}/p/${slug}/`;
  
  // Generate related links
  const relatedLinks = generateRelatedLinks(combo, dimValues);
  
  return {
    slug,
    url,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | AI Future Visualizer</title>
  <meta name="description" content="${description.substring(0, 155)}">
  <link rel="canonical" href="${url}">
  
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description.substring(0, 155)}">
  <meta property="og:url" content="${url}">
  <meta property="og:type" content="website">
  <meta property="og:image" content="${dimensions.tool_url}/og-image.png">
  
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description.substring(0, 155)}">
  
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "${title}",
    "description": "${description}",
    "url": "${url}",
    "isPartOf": {
      "@type": "WebApplication",
      "name": "AI Future Visualizer",
      "url": "${dimensions.tool_url}"
    }
  }
  </script>
  
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700&family=Rajdhani:wght@400;500;600&display=swap" rel="stylesheet">
  
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-P4ZLGKH1E1"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-P4ZLGKH1E1', { 'tool_name': 'future-visualizer' });
  </script>
  
  <style>
    :root {
      --bg: #0a0a0f;
      --text: #e0e0e0;
      --accent: #00ffcc;
      --accent2: #ff00ff;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Rajdhani', sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.6;
      min-height: 100vh;
    }
    .container { max-width: 900px; margin: 0 auto; padding: 2rem; }
    h1 {
      font-family: 'Orbitron', sans-serif;
      font-size: 2.5rem;
      background: linear-gradient(90deg, var(--accent), var(--accent2));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 1.5rem;
    }
    h2 { font-family: 'Orbitron', sans-serif; color: var(--accent); margin: 2rem 0 1rem; }
    p { margin-bottom: 1rem; font-size: 1.1rem; }
    .cta {
      display: inline-block;
      background: linear-gradient(135deg, var(--accent), var(--accent2));
      color: var(--bg);
      padding: 1rem 2rem;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      font-family: 'Orbitron', sans-serif;
      margin: 2rem 0;
      transition: transform 0.2s;
    }
    .cta:hover { transform: scale(1.05); }
    .related { margin-top: 3rem; padding-top: 2rem; border-top: 1px solid #333; }
    .related a {
      display: inline-block;
      color: var(--accent);
      margin: 0.5rem 1rem 0.5rem 0;
      text-decoration: none;
    }
    .related a:hover { text-decoration: underline; }
    .back { margin-bottom: 2rem; }
    .back a { color: var(--accent); text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="back"><a href="${dimensions.tool_url}">← Back to AI Future Visualizer</a></div>
    
    <h1>${title}</h1>
    
    <section>
      <h2>Glimpse Into Tomorrow</h2>
      ${bodyContent || `<p>Explore what ${productDisplay} will evolve into in the coming years. Our AI analyzes current trends, technological trajectories, and societal shifts to predict the future.</p>`}
      <p>From revolutionary interfaces to transformative business models, discover how innovation will reshape ${productDisplay} and impact our daily lives.</p>
    </section>
    
    <a class="cta" href="${dimensions.tool_url}?ref=seo&topic=${encodeURIComponent(productName)}">Visualize the Future of ${productDisplay} →</a>
    
    <section class="related">
      <h2>Related Future Visions</h2>
      ${relatedLinks}
    </section>
  </div>
</body>
</html>`
  };
}

function generateRelatedLinks(currentCombo, dimValues) {
  const links = [];
  const allDims = dimensions.dimensions;
  
  // Get related pages by swapping one dimension value
  for (const dim of allDims) {
    if (dimValues[dim.name]) {
      const otherValues = dim.values_en.filter(v => v !== dimValues[dim.name]).slice(0, 2);
      for (const val of otherValues) {
        const newDimValues = { ...dimValues, [dim.name]: val };
        const newCombo = Object.values(newDimValues).filter(Boolean);
        const slug = newCombo.join('-');
        const title = `Future of ${capitalize(val)}`;
        links.push(`<a href="/p/${slug}/">${title}</a>`);
      }
    }
  }
  
  return links.slice(0, 6).join('\n      ');
}

function generateAllPages() {
  console.log('🚀 Starting Programmatic SEO generation...');
  
  // Clean output directory
  if (fs.existsSync(OUTPUT_DIR)) {
    fs.rmSync(OUTPUT_DIR, { recursive: true });
  }
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  
  const allUrls = [];
  const dimMap = {};
  
  // Build dimension map for quick lookup
  for (const dim of dimensions.dimensions) {
    dimMap[dim.name] = dim.values_en;
  }
  
  // Generate pages for each combination type
  for (const combo of dimensions.combinations) {
    console.log(`  Generating: ${combo.join(' × ')}`);
    
    const arrays = combo.map(dimName => dimMap[dimName] || []);
    const cartesian = cartesianProduct(arrays);
    
    for (const values of cartesian) {
      const dimValues = {};
      combo.forEach((dimName, i) => {
        dimValues[dimName] = values[i];
      });
      
      const page = generatePageContent(values, dimValues);
      const pageDir = path.join(OUTPUT_DIR, page.slug);
      
      fs.mkdirSync(pageDir, { recursive: true });
      fs.writeFileSync(path.join(pageDir, 'index.html'), page.html);
      
      allUrls.push(page.url);
    }
  }
  
  console.log(`\n📄 Generated ${allUrls.length} pages`);
  
  // Generate sitemap-programmatic.xml
  generateSitemap(allUrls);
  
  // Generate sitemap-main.xml
  generateMainSitemap();
  
  // Generate sitemap.xml (sitemapindex)
  generateSitemapIndex();
  
  console.log('✅ Programmatic SEO generation complete!');
  return allUrls.length;
}

function cartesianProduct(arrays) {
  if (arrays.length === 0) return [[]];
  
  return arrays.reduce((acc, curr) => {
    const result = [];
    for (const a of acc) {
      for (const c of curr) {
        result.push([...a, c]);
      }
    }
    return result;
  }, [[]]);
}

function generateSitemap(urls) {
  const today = new Date().toISOString().split('T')[0];
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;
  
  for (const url of urls) {
    xml += `  <url>
    <loc>${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
`;
  }
  
  xml += `</urlset>`;
  
  fs.writeFileSync(SITEMAP_PATH, xml);
  console.log(`📍 Generated sitemap-programmatic.xml with ${urls.length} URLs`);
}

function generateMainSitemap() {
  const today = new Date().toISOString().split('T')[0];
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${dimensions.tool_url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${dimensions.tool_url}/pricing</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;
  
  fs.writeFileSync(SITEMAP_MAIN_PATH, xml);
  console.log('📍 Generated sitemap-main.xml');
}

function generateSitemapIndex() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${dimensions.tool_url}/sitemap-main.xml</loc>
  </sitemap>
  <sitemap>
    <loc>${dimensions.tool_url}/sitemap-programmatic.xml</loc>
  </sitemap>
</sitemapindex>`;
  
  fs.writeFileSync(SITEMAP_INDEX_PATH, xml);
  console.log('📍 Generated sitemap.xml (sitemapindex)');
}

// Run
const pageCount = generateAllPages();
console.log(`\n🎉 Total: ${pageCount} programmatic SEO pages generated!`);
