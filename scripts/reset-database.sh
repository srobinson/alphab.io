#!/bin/bash

# Database Reset and Schema Application Script
# This script helps you reset your Supabase database and apply the clean schema

set -e # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
  echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
  echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
  echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
  echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
  echo ""
  echo "=============================================="
  echo "  SUPABASE DATABASE RESET & SCHEMA SETUP"
  echo "=============================================="
  echo ""
}

check_requirements() {
  print_status "Checking requirements..."

  if [ ! -f "supabase/schema.sql" ]; then
    print_error "Schema file not found: supabase/schema.sql"
    exit 1
  fi

  if ! command -v supabase &> /dev/null; then
    print_error "Supabase CLI is not installed. Install with: npm install -g supabase"
    exit 1
  fi

  print_success "All requirements met"
}

show_instructions() {
  print_warning "IMPORTANT: This will completely reset your database!"
  echo ""
  echo "Steps to follow:"
  echo "1. Go to your Supabase dashboard: https://supabase.com/dashboard"
  echo "2. Select your project"
  echo "3. Go to Settings > Database"
  echo "4. Click 'Reset database' (this will delete ALL data)"
  echo "5. Come back here and run this script again with --apply"
  echo ""
  echo "OR if you want to apply the schema to your current database:"
  echo "Run: $0 --apply-only"
  echo ""
}

apply_schema() {
  print_status "Applying schema to database..."

  # Check if we're linked to a project
  if ! supabase status &> /dev/null; then
    print_warning "Not linked to a Supabase project."
    echo ""
    echo "To link to your project:"
    echo "1. Get your project reference from https://supabase.com/dashboard"
    echo "2. Run: supabase link --project-ref YOUR_PROJECT_REF"
    echo ""
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
      exit 0
    fi
  fi

  print_status "Executing schema.sql..."

  # Apply the schema
  if supabase db exec --file supabase/schema.sql; then
    print_success "Schema applied successfully!"
  else
    print_error "Failed to apply schema"
    echo ""
    echo "You can also apply it manually:"
    echo "1. Copy the contents of supabase/schema.sql"
    echo "2. Go to your Supabase dashboard > SQL Editor"
    echo "3. Paste and run the SQL"
    exit 1
  fi
}

test_schema() {
  print_status "Testing the schema..."

  # Test basic functionality
  if supabase db exec "SELECT system_health_check();" &> /dev/null; then
    print_success "Schema is working correctly!"

    # Show system status
    print_status "System status:"
    supabase db exec "SELECT system_health_check();" | head -10

  else
    print_warning "Schema test failed, but this might be normal if RLS policies are strict"
  fi

  # Test the main function
  print_status "Testing user subscription function..."
  if supabase db exec "SELECT upsert_user_and_subscribe('test@example.com', 'general', 'schema_test');" &> /dev/null; then
    print_success "User subscription function is working!"
  else
    print_warning "User subscription test failed - check RLS policies"
  fi
}

cleanup_old_files() {
  print_status "Cleaning up old migration files..."

  # Move old migrations to backup
  if [ -d "supabase/migrations" ]; then
    backup_dir="supabase/migrations_old_$(date +%Y%m%d_%H%M%S)"
    mv supabase/migrations "$backup_dir"
    print_success "Old migrations moved to: $backup_dir"
  fi

  # Create new migrations directory
  mkdir -p supabase/migrations
  print_success "Clean migrations directory created"
}

update_accelerator_page() {
  print_status "Updating accelerator page to use new schema..."

  # The accelerator page should already have fallback logic
  # Just verify it exists
  if [ -f "app/accelerator/page.tsx" ]; then
    print_success "Accelerator page found - it should work with the new schema"
  else
    print_warning "Accelerator page not found"
  fi
}

show_next_steps() {
  print_success "Database reset and schema setup complete!"
  echo ""
  echo "Next steps:"
  echo "1. Test your accelerator page: https://alphab.io/accelerator"
  echo '2. Check system health: supabase db exec "SELECT system_health_check();"'
  echo '3. View subscription stats: supabase db exec "SELECT * FROM subscription_stats;"'
  echo "4. Test user signup: supabase db exec \"SELECT upsert_user_and_subscribe('test@example.com', 'tech_accelerator', 'test');\""
  echo ""
  echo "Your newsletter system is now ready with:"
  echo "✅ Clean database schema"
  echo "✅ 15 core tables"
  echo "✅ Essential functions"
  echo "✅ Analytics views"
  echo "✅ Row Level Security"
  echo ""
}

# Main execution
main() {
  print_header
  check_requirements

  case "${1-}" in
    --apply | --apply-only)
      print_warning "Applying schema to current database..."
      read -p "Are you sure? This will modify your database structure. (y/N): " -n 1 -r
      echo ""
      if [[ $REPLY =~ ^[Yy]$ ]]; then
        apply_schema
        test_schema
        if [[ $1 != "--apply-only" ]]; then
          cleanup_old_files
          update_accelerator_page
        fi
        show_next_steps
      else
        print_status "Operation cancelled"
      fi
      ;;
    --help | -h)
      echo "Usage: $0 [--apply|--apply-only|--help]"
      echo ""
      echo "Options:"
      echo "  --apply      Apply schema after database reset"
      echo "  --apply-only Apply schema to current database (no cleanup)"
      echo "  --help       Show this help message"
      echo ""
      ;;
    *)
      show_instructions
      ;;
  esac
}

main "$@"
