#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

// Use service role key for admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixArticleTimestamps() {
  console.log('🔧 Fixing article timestamps...');

  try {
    // Get all articles that are missing created_at
    const { data: articles, error } = await supabase
      .from('articles')
      .select('id, title, published_at, created_at, updated_at')
      .is('created_at', null)
      .order('id');

    if (error) {
      console.error('Error fetching articles:', error);
      return;
    }

    if (!articles || articles.length === 0) {
      console.log('✅ No articles need timestamp fixes');
      return;
    }

    console.log(`📊 Found ${articles.length} articles without created_at timestamps`);

    // Update each article with a created_at timestamp
    // We'll use published_at if available, otherwise a default date
    for (let i = 0; i < articles.length; i++) {
      const article = articles[i];
      const now = new Date();

      // For articles with published_at, use that as created_at
      // For articles without published_at, use a date that spaces them out
      let createdAt;
      if (article.published_at) {
        createdAt = article.published_at;
      } else {
        // Space them out by ID to create some ordering
        // Use a base date and add some time based on ID
        const baseDate = new Date('2025-10-01T00:00:00Z');
        const idHash = article.id.split('').reduce((a, b) => {
          a = ((a << 5) - a) + b.charCodeAt(0);
          return a & a;
        }, 0);
        const offsetMinutes = Math.abs(idHash) % (24 * 60); // Spread over 24 hours
        createdAt = new Date(baseDate.getTime() + offsetMinutes * 60 * 1000).toISOString();
      }

      const updatedAt = now.toISOString();

      const { error: updateError } = await supabase
        .from('articles')
        .update({
          created_at: createdAt,
          updated_at: updatedAt
        })
        .eq('id', article.id);

      if (updateError) {
        console.error(`❌ Failed to update article ${article.id}:`, updateError);
      } else {
        console.log(`✅ Updated ${article.title} (${article.id})`);
      }
    }

    console.log('🎉 Timestamp fix completed!');

  } catch (error) {
    console.error('❌ Error fixing timestamps:', error);
  }
}

fixArticleTimestamps();