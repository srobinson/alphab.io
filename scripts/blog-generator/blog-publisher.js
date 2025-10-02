#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const matter = require('gray-matter');

const CONTENT_DIR = path.join(__dirname, '../../content/blog');
const PUBLIC_CONTENT_DIR = path.join(__dirname, '../../public/content/blog');

class BlogPublisher {
  constructor() {
    this.draftsPath = path.join(__dirname, '../../app/blog_generated/drafts');
    this.postsPath = path.join(__dirname, '../../app/blog_generated/posts');
    this.contentPath = CONTENT_DIR;
    this.publicContentPath = PUBLIC_CONTENT_DIR;
  }

  async initialize() {
    await Promise.all([
      fs.mkdir(this.postsPath, { recursive: true }),
      fs.mkdir(this.contentPath, { recursive: true }),
      fs.mkdir(this.publicContentPath, { recursive: true })
    ]);

    console.log('📖 Blog Publisher initialized');
  }

  async publishDraft(draftId) {
    console.log(`📝 Publishing draft: ${draftId}`);

    const draftData = await this.loadDraft(draftId);
    const slug = await this.generateUniqueSlug(draftData.frontmatter.title, draftId);

    const mdxContent = this.createMDXContent({ ...draftData, slug });
    const metadata = this.createMetadata(draftData.frontmatter, slug, draftId);

    const mdxPath = await this.writeContentFile(`${slug}.mdx`, mdxContent);
    const metadataPath = await this.writeContentFile(`${slug}.meta.json`, JSON.stringify(metadata, null, 2));

    await this.updateBlogIndex(metadata);

    console.log('✅ Published successfully!');
    console.log(`📄 MDX file: ${mdxPath}`);
    console.log(`🔗 URL: /blog/${slug}`);

    return { slug, mdxPath, metadataPath };
  }

  async loadDraft(draftId) {
    const draftPath = path.join(this.draftsPath, `${draftId}.json`);
    try {
      const rawDraft = await fs.readFile(draftPath, 'utf8');
      return JSON.parse(rawDraft);
    } catch (error) {
      throw new Error(`Unable to read draft ${draftId}: ${error.message}`);
    }
  }

  async generateUniqueSlug(title, draftId) {
    if (draftId) {
      const existingSlug = await this.findExistingSlugForDraft(draftId);
      if (existingSlug) {
        return existingSlug;
      }
    }

    const baseSlug = (title || '')
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 60) || `post-${Date.now()}`;

    let slug = baseSlug;
    let attempt = 1;
    while (await this.slugExists(slug)) {
      const suffix = `${draftId || Date.now()}`.slice(-4);
      slug = `${baseSlug}-${suffix}${attempt > 1 ? `-${attempt}` : ''}`;
      attempt += 1;
    }

    return slug;
  }

  async slugExists(slug) {
    const target = path.join(this.contentPath, `${slug}.mdx`);
    try {
      await fs.access(target);
      return true;
    } catch {
      return false;
    }
  }

  async findExistingSlugForDraft(draftId) {
    try {
      const files = await fs.readdir(this.contentPath);
      for (const file of files) {
        if (!file.endsWith('.meta.json')) continue;
        const metadataPath = path.join(this.contentPath, file);
        try {
          const meta = JSON.parse(await fs.readFile(metadataPath, 'utf8'));
          if (meta.draftId === draftId && meta.slug) {
            return meta.slug;
          }
        } catch {
          // Ignore malformed metadata entries
        }
      }
    } catch {
      // Directory read errors are non-fatal
    }
    return null;
  }

  createMDXContent(draftData) {
    const { frontmatter, content, slug } = draftData;

    const schemaMarkup = `<script type="application/ld+json">
${JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: frontmatter.title,
  description: frontmatter.description,
  author: {
    '@type': 'Person',
    name: frontmatter.author
  },
  datePublished: frontmatter.date,
  keywords: (frontmatter.seo?.keywords || []).join(', '),
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': `https://alphab.io/blog/${slug}`
  }
}, null, 2)}
</script>

`;

    const body = `${schemaMarkup}${content}`;
    const frontmatterData = {
      ...frontmatter,
      generated: true
    };

    return matter.stringify(body.trimStart(), frontmatterData);
  }

  createMetadata(frontmatter, slug, draftId) {
    const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags : [];
    const seoKeywords = Array.isArray(frontmatter.seo?.keywords) ? frontmatter.seo.keywords : [];
    const seo = frontmatter.seo ? { ...frontmatter.seo, keywords: seoKeywords } : { keywords: seoKeywords };

    return {
      ...frontmatter,
      tags,
      seo,
      slug,
      published: true,
      publishedAt: new Date().toISOString(),
      draftId
    };
  }

  async writeContentFile(relativePath, contents) {
    const targetPath = path.join(this.contentPath, relativePath);
    const publicPath = path.join(this.publicContentPath, relativePath);

    await fs.mkdir(path.dirname(targetPath), { recursive: true });
    await fs.mkdir(path.dirname(publicPath), { recursive: true });

    await fs.writeFile(targetPath, contents);
    await fs.writeFile(publicPath, contents);

    return targetPath;
  }

  async deleteContentFile(relativePath) {
    const targets = [
      path.join(this.contentPath, relativePath),
      path.join(this.publicContentPath, relativePath)
    ];

    for (const target of targets) {
      try {
        await fs.unlink(target);
      } catch (error) {
        if (error.code !== 'ENOENT') {
          throw error;
        }
      }
    }
  }

  async deleteDraft(draftId) {
    if (!draftId) return;

    const draftPath = path.join(this.draftsPath, `${draftId}.json`);
    try {
      await fs.unlink(draftPath);
      console.log(`🗃️  Deleted draft: ${draftId}`);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
  }

  async readIndex() {
    const indexPath = path.join(this.contentPath, 'index.json');
    try {
      const raw = await fs.readFile(indexPath, 'utf8');
      return JSON.parse(raw);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return { posts: [], lastUpdated: null, totalPosts: 0 };
      }
      throw error;
    }
  }

  async updateBlogIndex(metadata) {
    const index = await this.readIndex();

    const postEntry = {
      slug: metadata.slug,
      title: metadata.title,
      description: metadata.description,
      date: metadata.date,
      publishedAt: metadata.publishedAt,
      category: metadata.category,
      tags: metadata.tags,
      readTime: metadata.readTime,
      generated: true,
      draftId: metadata.draftId
    };

    index.posts = index.posts.filter(post => {
      if (post.draftId && metadata.draftId && post.draftId === metadata.draftId) {
        return false;
      }
      return post.slug !== postEntry.slug;
    });
    index.posts.push(postEntry);

    const validatedPosts = [];
    for (const post of index.posts) {
      if (await this.slugExists(post.slug)) {
        validatedPosts.push(post);
      }
    }

    index.posts = validatedPosts;
    index.posts.sort((a, b) => new Date(b.publishedAt || b.date) - new Date(a.publishedAt || a.date));
    index.lastUpdated = new Date().toISOString();
    index.totalPosts = index.posts.length;

    await this.writeContentFile('index.json', JSON.stringify(index, null, 2));
    await this.createRSSFeed(index);
  }

  async listPublishedPosts() {
    try {
      const index = await this.readIndex();
      const posts = Array.isArray(index.posts) ? index.posts : [];
      return posts.sort((a, b) => new Date(b.publishedAt || b.date) - new Date(a.publishedAt || a.date));
    } catch (error) {
      console.warn('⚠️  Unable to read blog index:', error.message);
      return [];
    }
  }

  async createRSSFeed(indexData) {
    const index = indexData || await this.readIndex();

    const rssItems = index.posts.slice(0, 20).map(post => `
    <item>
      <title>${this.escapeXML(post.title)}</title>
      <link>https://alphab.io/blog/${post.slug}</link>
      <description>${this.escapeXML(post.description)}</description>
      <pubDate>${new Date(post.publishedAt || post.date).toUTCString()}</pubDate>
      <guid>https://alphab.io/blog/${post.slug}</guid>
      <category>${this.escapeXML(post.category)}</category>
    </item>`).join('');

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>RADE AI Blog</title>
    <link>https://alphab.io/blog</link>
    <description>AI insights and analysis from RADE AI Solutions</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://alphab.io/blog/rss.xml" rel="self" type="application/rss+xml"/>
    ${rssItems}
  </channel>
</rss>`;

    await this.writeContentFile('rss.xml', rss);
    console.log(`📡 RSS feed updated: ${path.join(this.contentPath, 'rss.xml')}`);
  }

  async loadMetadataForSlug(slug) {
    const metadataPath = path.join(this.contentPath, `${slug}.meta.json`);
    try {
      const raw = await fs.readFile(metadataPath, 'utf8');
      const parsed = JSON.parse(raw);
      return parsed;
    } catch {
      return null;
    }
  }

  async resolveSlug(identifier) {
    if (!identifier) {
      return null;
    }

    const directPath = path.join(this.contentPath, `${identifier}.mdx`);
    try {
      await fs.access(directPath);
      return identifier;
    } catch {
      // ignore
    }

    const slugFromDraft = await this.findExistingSlugForDraft(identifier);
    return slugFromDraft;
  }

  async unpublish(target) {
    const slug = await this.resolveSlug(target);

    if (!slug) {
      throw new Error(`Unable to locate a published post for "${target}"`);
    }

    const metadata = await this.loadMetadataForSlug(slug);
    const draftId = metadata?.draftId || (await this.lookupDraftIdBySlug(slug));

    await this.deleteContentFile(`${slug}.mdx`);
    await this.deleteContentFile(`${slug}.meta.json`);

    const index = await this.readIndex();
    const filteredPosts = index.posts.filter(post => {
      if (post.slug === slug) return false;
      if (draftId && post.draftId === draftId) return false;
      if (target && post.slug === target) return false;
      if (target && post.draftId === target) return false;
      return true;
    });

    index.posts = filteredPosts;
    index.totalPosts = filteredPosts.length;
    index.lastUpdated = new Date().toISOString();

    await this.writeContentFile('index.json', JSON.stringify(index, null, 2));
    await this.createRSSFeed(index);

    console.log(`🗑️  Unpublished post: ${slug}`);
    if (draftId) {
      await this.deleteDraft(draftId);
    }
  }

  async lookupDraftIdBySlug(slug) {
    const index = await this.readIndex();
    const post = Array.isArray(index.posts) ? index.posts.find(p => p.slug === slug) : null;
    return post?.draftId;
  }

  async resetAll() {
    console.log('♻️  Resetting generated blog content...');

    const index = await this.readIndex();
    const posts = Array.isArray(index.posts) ? index.posts : [];

    for (const post of posts) {
      if (post.slug) {
        await this.deleteContentFile(`${post.slug}.mdx`);
        await this.deleteContentFile(`${post.slug}.meta.json`);
      }
      if (post.draftId) {
        await this.deleteDraft(post.draftId);
      }
    }

    index.posts = [];
    index.totalPosts = 0;
    index.lastUpdated = new Date().toISOString();

    await this.writeContentFile('index.json', JSON.stringify(index, null, 2));
    await this.createRSSFeed(index);

    console.log('✅ Blog index reset. No generated posts remain.');
  }

  async listDrafts() {
    try {
      const files = await fs.readdir(this.draftsPath);
      const drafts = [];

      for (const file of files) {
        if (!file.endsWith('.json')) continue;
        const draftId = file.replace('.json', '');
        const data = await this.loadDraft(draftId);
        drafts.push({
          id: draftId,
          title: data.frontmatter.title,
          category: data.frontmatter.category,
          createdAt: data.metadata.generatedAt,
          cost: data.metadata.cost
        });
      }

      return drafts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch {
      return [];
    }
  }

  async previewDraft(draftId) {
    const draftData = await this.loadDraft(draftId);

    console.log(`\n📖 PREVIEW: ${draftData.frontmatter.title}`);
    console.log(`📅 Date: ${draftData.frontmatter.date}`);
    console.log(`🏷️  Category: ${draftData.frontmatter.category}`);
    console.log(`⏱️  Read Time: ${draftData.frontmatter.readTime}`);
    console.log(`💰 Generation Cost: $${draftData.metadata.cost.toFixed(4)}`);
    console.log(`\n📝 Description:`);
    console.log(draftData.frontmatter.description);
    console.log(`\n🔍 Keywords:`);
    console.log((draftData.frontmatter.seo?.keywords || []).join(', '));
    console.log(`\n📄 Content Preview (first 500 chars):`);
    console.log((draftData.content || '').substring(0, 500) + '...');

    return draftData;
  }

  escapeXML(str) {
    return String(str || '').replace(/[<>&'"\\]/g, (c) => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '"': return '&quot;';
        case "'": return '&#39;';
        case '\\': return '&#92;';
        default: return c;
      }
    });
  }
}

// CLI interface
if (require.main === module) {
  const publisher = new BlogPublisher();
  let command = process.argv[2];
  let draftId = process.argv[3];

  const validCommands = new Set(['list', 'preview', 'publish', 'unpublish', 'reset', 'rss']);

  if (command && !validCommands.has(command)) {
    // Treat the first argument as a draft ID for publish convenience
    draftId = command;
    command = 'publish';
  }

  publisher.initialize().then(async () => {
    switch (command) {
      case 'list': {
        const drafts = await publisher.listDrafts();
        console.log('\n📋 AVAILABLE DRAFTS:');
        if (drafts.length === 0) {
          console.log('No drafts found. Generate one first with blog-generator.js');
        } else {
          drafts.forEach((draft, i) => {
            console.log(`${i + 1}. ${draft.id}`);
            console.log(`   Title: ${draft.title}`);
            console.log(`   Category: ${draft.category}`);
            console.log(`   Created: ${new Date(draft.createdAt).toLocaleDateString()}`);
            console.log(`   Cost: $${draft.cost.toFixed(4)}`);
            console.log('');
          });
        }
        break;
      }
      case 'preview':
        if (!draftId) {
          console.log('Usage: node blog-publisher.js preview <draft-id>');
          process.exit(1);
        }
        await publisher.previewDraft(draftId);
        break;
      case 'publish':
        if (!draftId) {
          console.log('Usage: node blog-publisher.js publish <draft-id>');
          process.exit(1);
        }
        const result = await publisher.publishDraft(draftId);
        console.log(`\n🎉 Blog post published successfully!`);
        console.log(`Now commit and push to deploy: git add . && git commit -m "Add blog post: ${result.slug}"`);
        break;
      case 'unpublish':
        if (!draftId) {
          const published = await publisher.listPublishedPosts();
          console.log('\n📚 PUBLISHED POSTS:');
          if (published.length === 0) {
            console.log('No generated posts are currently published.');
          } else {
            published.forEach((post, idx) => {
              console.log(`${idx + 1}. ${post.slug}`);
              if (post.title) {
                console.log(`   Title: ${post.title}`);
              }
              if (post.draftId) {
                console.log(`   Draft ID: ${post.draftId}`);
              }
              console.log(`   Published: ${new Date(post.publishedAt || post.date).toLocaleString()}`);
            });
            console.log('\nRun: node blog-publisher.js unpublish <slug-or-draft-id>');
          }
          break;
        }
        await publisher.unpublish(draftId);
        break;
      case 'reset':
        await publisher.resetAll();
        break;
      case 'rss':
        await publisher.createRSSFeed();
        break;
      default:
        console.log('Blog Publisher Commands:');
        console.log('  list                     - List all drafts');
        console.log('  preview <draft-id>       - Preview a draft');
        console.log('  publish <draft-id>       - Publish a draft to static files');
        console.log('  unpublish <slug|draft-id>- Remove a generated blog post');
        console.log('  reset                    - Remove all generated posts & drafts');
        console.log('  rss                      - Update RSS feed');
        console.log('');
        console.log('Example workflow:');
        console.log('  1. node blog-generator.js "AI Topic" analysis');
        console.log('  2. node blog-publisher.js list');
        console.log('  3. node blog-publisher.js preview <draft-id>');
        console.log('  4. node blog-publisher.js publish <draft-id>');
    }
  }).catch(error => {
    console.error('❌ Publisher failed:', error.message);
    process.exit(1);
  });
}

module.exports = BlogPublisher;
