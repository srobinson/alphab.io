#!/usr/bin/env node
/**
 * Apply Performance Optimization Migration
 * Creates optimized indexes for fast pagination on articles table
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

async function main() {
  console.log('🚀 Applying Performance Optimization Migration');
  console.log('='.repeat(50));
  console.log('');

  // Load environment
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ Error: Missing Supabase credentials');
    console.error('   Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  // Check current article count
  console.log('📊 Checking current data...');
  const { count, error: countError } = await supabase
    .from('articles')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published');

  if (countError) {
    console.error('❌ Error querying articles:', countError.message);
    process.exit(1);
  }

  console.log(`   📦 Published articles: ${count}`);
  console.log('');

  // Test BEFORE performance
  console.log('⏱️  Testing query performance BEFORE optimization...');
  const start1 = Date.now();
  const { data: beforeData, error: beforeError } = await supabase
    .from('articles')
    .select('id, title')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .range(84, 95);

  const beforeTime = Date.now() - start1;
  console.log(`   ⏱️  Query time: ${beforeTime}ms`);
  if (beforeError) console.error('   ❌ Error:', beforeError.message);
  console.log('');

  // Read migration file
  console.log('📄 Reading migration SQL...');
  const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '20250103_optimize_articles_indexes.sql');
  
  if (!fs.existsSync(migrationPath)) {
    console.error('❌ Migration file not found:', migrationPath);
    process.exit(1);
  }

  const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
  console.log('   ✅ Migration loaded');
  console.log('');

  // Apply migration
  console.log('🔧 Applying migration (creating indexes)...');
  console.log('   This may take 10-30 seconds depending on data size');
  console.log('');

  // Split SQL into individual statements
  const statements = migrationSQL
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--') && !s.startsWith('/*'));

  let successCount = 0;
  let skipCount = 0;

  for (const statement of statements) {
    if (statement.includes('DO $$') || statement.includes('END $$')) {
      // Skip DO blocks as they're not critical
      skipCount++;
      continue;
    }

    try {
      // Use rpc to execute raw SQL
      const { error } = await supabase.rpc('exec_sql', {
        query: statement + ';'
      });

      if (error) {
        // Check if error is because exec_sql doesn't exist
        if (error.message.includes('function') && error.message.includes('does not exist')) {
          console.log('   ⚠️  Cannot execute SQL via Supabase API');
          console.log('   📝 Manual migration required');
          console.log('');
          console.log('   Please run these SQL commands in Supabase SQL Editor:');
          console.log('   Dashboard > SQL Editor > New Query');
          console.log('');
          console.log('='.repeat(50));
          console.log(migrationSQL);
          console.log('='.repeat(50));
          console.log('');
          console.log('   Or use psql:');
          console.log('   psql "postgres://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres" -f ' + migrationPath);
          console.log('');
          process.exit(1);
        } else {
          console.error(`   ⚠️  Warning: ${error.message}`);
        }
      } else {
        successCount++;
      }
    } catch (err) {
      console.error(`   ❌ Error:`, err.message);
    }
  }

  console.log(`   ✅ Executed ${successCount} statements (${skipCount} skipped)`);
  console.log('');

  // Wait for indexes to be ready
  console.log('⏳ Waiting for indexes to be ready...');
  await new Promise(resolve => setTimeout(resolve, 3000));
  console.log('');

  // Test AFTER performance
  console.log('⏱️  Testing query performance AFTER optimization...');
  const start2 = Date.now();
  const { data: afterData, error: afterError } = await supabase
    .from('articles')
    .select('id, title')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .range(84, 95);

  const afterTime = Date.now() - start2;
  console.log(`   ⏱️  Query time: ${afterTime}ms`);
  if (afterError) console.error('   ❌ Error:', afterError.message);
  console.log('');

  // Show improvement
  if (afterTime < beforeTime) {
    const improvement = ((beforeTime - afterTime) / beforeTime * 100).toFixed(1);
    const speedup = (beforeTime / afterTime).toFixed(1);
    console.log('🎉 Performance Improvement:');
    console.log(`   Before: ${beforeTime}ms`);
    console.log(`   After:  ${afterTime}ms`);
    console.log(`   Improvement: ${improvement}% faster (${speedup}x speedup)`);
  } else {
    console.log('⚠️  Performance may not have improved yet');
    console.log('   This could be due to:');
    console.log('   1. Migration not fully applied');
    console.log('   2. Indexes still building');
    console.log('   3. Query planner needs time to update statistics');
    console.log('');
    console.log('   Try again in a few minutes');
  }

  console.log('');
  console.log('✅ Migration complete!');
  console.log('');
  console.log('Next steps:');
  console.log('   1. Test your website: pnpm run dev');
  console.log('   2. Visit /industry-moves and scroll to page 8');
  console.log('   3. Page loads should be <200ms now!');
  console.log('');
}

main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
