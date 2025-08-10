import { NextResponse } from "next/server";

// This would typically fetch from your CMS or database
// For now, using placeholder data
const getBlogPosts = async () => {
  return [
    {
      title: "The Rise of Multimodal AI: Analyzing GPT-4V and Beyond",
      description:
        "Deep dive into the latest multimodal AI capabilities and their implications for business applications.",
      slug: "multimodal-ai-gpt4v-analysis",
      publishedAt: "2024-01-15T10:00:00Z",
      category: "AI Research",
    },
    {
      title: "Retrieval-Augmented Generation: The Future of Enterprise AI",
      description:
        "How RAG is transforming enterprise AI applications and why it matters for your business.",
      slug: "rag-enterprise-ai-future",
      publishedAt: "2024-01-14T10:00:00Z",
      category: "Enterprise AI",
    },
    {
      title: "Anthropic's Constitutional AI: A New Paradigm for AI Safety",
      description:
        "Exploring Anthropic's approach to AI alignment and what it means for responsible AI development.",
      slug: "anthropic-constitutional-ai-safety",
      publishedAt: "2024-01-13T10:00:00Z",
      category: "AI Safety",
    },
  ];
};

export async function GET() {
  const posts = await getBlogPosts();
  const baseUrl = "https://alphab.io";

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>RADE AI Tech Blog</title>
    <description>Daily insights into cutting-edge AI technologies, research papers, and emerging tech trends</description>
    <link>${baseUrl}/blog</link>
    <language>en-US</language>
    <managingEditor>contact@alphab.io (RADE AI Solutions)</managingEditor>
    <webMaster>contact@alphab.io (RADE AI Solutions)</webMaster>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/blog/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${baseUrl}/images/rade-logo.svg</url>
      <title>RADE AI Tech Blog</title>
      <link>${baseUrl}/blog</link>
      <width>144</width>
      <height>144</height>
    </image>
    <category>Technology</category>
    <category>Artificial Intelligence</category>
    <category>Machine Learning</category>
    <category>AI Research</category>
    <ttl>60</ttl>
    ${
    posts
      .map(
        (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.description}]]></description>
      <link>${baseUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <category><![CDATA[${post.category}]]></category>
      <author>contact@alphab.io (RADE AI Solutions)</author>
    </item>`,
      )
      .join("")
  }
  </channel>
</rss>`;

  return new NextResponse(rssXml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
