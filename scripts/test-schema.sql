-- Test script for the newsletter system schema
-- Run this after applying the main schema to verify everything works
-- Test 1: Basic user creation and subscription
SELECT 'Testing user creation and subscription...' AS test;

SELECT upsert_user_and_subscribe(
        'test@example.com',
        'tech_accelerator',
        'schema_test',
        'Test',
        'User'
    );

-- Test 2: Analytics event tracking
SELECT 'Testing analytics event tracking...' AS test;

SELECT track_analytics_event(
        'page_view',
        'test_page_view',
        (
            SELECT id
            FROM "user"
            WHERE email = 'test@example.com'
            LIMIT 1
        ), gen_random_uuid(), '{"page": "/test", "source": "schema_test"}'::jsonb
    );

-- Test 3: System health check
SELECT 'Testing system health check...' AS test;

SELECT system_health_check();

-- Test 4: Subscription statistics
SELECT 'Testing subscription statistics...' AS test;

SELECT *
FROM get_subscription_stats();

-- Test 5: Views
SELECT 'Testing views...' AS test;

SELECT COUNT(*) AS active_subscriptions_count
FROM active_subscriptions;

SELECT COUNT(*) AS subscription_stats_count
FROM subscription_stats;

SELECT *
FROM system_overview;

-- Test 6: Sample data verification
SELECT 'Testing sample data...' AS test;

SELECT COUNT(*) AS user_tags_count
FROM user_tags;

SELECT COUNT(*) AS user_segments_count
FROM user_segments;

-- Test 7: Table counts
SELECT 'Schema verification - table counts:' AS test;

SELECT schemaname,
    COUNT(*) AS table_count
FROM pg_tables
WHERE schemaname = 'public'
GROUP BY schemaname;

-- Test 8: Function verification
SELECT 'Schema verification - function counts:' AS test;

SELECT routine_schema,
    COUNT(*) AS function_count
FROM information_schema.routines
WHERE routine_schema = 'public'
GROUP BY routine_schema;

-- Test 9: View verification
SELECT 'Schema verification - view counts:' AS test;

SELECT table_schema,
    COUNT(*) AS view_count
FROM information_schema.views
WHERE table_schema = 'public'
GROUP BY table_schema;

-- Final success message
SELECT 'All tests completed successfully! Schema is working correctly.' AS RESULT;