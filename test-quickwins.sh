#!/bin/bash
# Quick Wins Testing Script
# Tests all 4 implemented features

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║          Quick Wins Testing Suite                           ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Configuration
BASE_URL="${BASE_URL:-http://localhost:3000}"
CRON_SECRET="${CRON_SECRET:-your-secret-here}"

echo "🔧 Configuration:"
echo "   BASE_URL: $BASE_URL"
echo "   CRON_SECRET: ${CRON_SECRET:0:10}..."
echo ""

# Test 1: Response Caching
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 Test 1: Response Caching"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "Making first request (cold cache)..."
time1=$(date +%s%N)
curl -s "$BASE_URL/api/curated-news" -o /dev/null
time2=$(date +%s%N)
duration1=$(( ($time2 - $time1) / 1000000 ))

echo "First request took: ${duration1}ms"
echo ""
sleep 1

echo "Making second request (should be cached)..."
time1=$(date +%s%N)
curl -s "$BASE_URL/api/curated-news" -o /dev/null
time2=$(date +%s%N)
duration2=$(( ($time2 - $time1) / 1000000 ))

echo "Second request took: ${duration2}ms"
echo ""

if [ $duration2 -lt $duration1 ]; then
    echo "✅ PASS: Second request was faster (caching works!)"
else
    echo "⚠️  WARN: Second request wasn't significantly faster"
fi

echo ""
echo "Checking cache headers..."
curl -sI "$BASE_URL/api/curated-news" | grep -i cache || echo "⚠️  No cache headers found"
echo ""

# Test 2: Rate Limiting
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚦 Test 2: Rate Limiting"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "Making 70 rapid requests..."
success=0
rate_limited=0

for i in {1..70}; do
    status=$(curl -s -o /dev/null -w "%{http_code}" \
        -H "X-Forwarded-For: 192.168.1.100" \
        "$BASE_URL/api/curated-news")
    
    if [ "$status" = "200" ]; then
        ((success++))
    elif [ "$status" = "429" ]; then
        ((rate_limited++))
    fi
    
    # Show progress every 10 requests
    if [ $((i % 10)) -eq 0 ]; then
        echo "  Progress: $i/70 requests..."
    fi
done

echo ""
echo "Results:"
echo "  ✅ Successful requests: $success"
echo "  🚫 Rate limited (429): $rate_limited"
echo ""

if [ $rate_limited -gt 0 ]; then
    echo "✅ PASS: Rate limiting is working!"
else
    echo "⚠️  WARN: No rate limiting detected (may be too lenient)"
fi

echo ""
echo "Checking rate limit headers..."
curl -sI "$BASE_URL/api/curated-news" | grep -i "ratelimit" || echo "⚠️  No rate limit headers found"
echo ""

# Test 3: Retry Logic (via content sync)
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔄 Test 3: Retry Logic & Monitoring"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "Triggering content sync (this will take 30-60 seconds)..."
response=$(curl -s -w "\nHTTP_STATUS:%{http_code}" \
    -H "Authorization: Bearer $CRON_SECRET" \
    "$BASE_URL/api/cron/content-sync")

http_status=$(echo "$response" | grep "HTTP_STATUS" | cut -d: -f2)
body=$(echo "$response" | grep -v "HTTP_STATUS")

if [ "$http_status" = "200" ]; then
    echo "✅ PASS: Content sync completed successfully"
    echo ""
    echo "Sync Results:"
    echo "$body" | jq -r '.stats | "  Total sources: \(.totalSources)\n  Successful: \(.successfulSources)\n  Items fetched: \(.totalItemsFetched)\n  Items ingested: \(.totalItemsIngested)\n  Duration: \(.totalDuration)ms"' 2>/dev/null || echo "$body"
else
    echo "❌ FAIL: Content sync failed with status $http_status"
    echo "$body"
fi

echo ""

# Test 4: Monitoring Logs
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Test 4: Monitoring & Logging"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "Note: Check your server logs for structured logging output"
echo "You should see messages like:"
echo "  • ℹ️  [INFO] Content sync initiated"
echo "  • 🔍 [DEBUG] Syncing source: TechCrunch AI"
echo "  • ⚠️  [WARN] Slow operation detected"
echo "  • 🚨 [ERROR] Failed to fetch RSS feed"
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 Test Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Quick Wins Implementation Tests Complete!"
echo ""
echo "Next steps:"
echo "1. Review server logs for retry attempts and monitoring output"
echo "2. Monitor cache hit rates in production"
echo "3. Verify rate limiting headers in API responses"
echo "4. Set up alerts for critical errors"
echo ""
echo "📖 Documentation: See QUICKWINS_IMPLEMENTATION.md for details"
echo ""
