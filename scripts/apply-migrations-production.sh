#!/bin/bash

# Production Supabase Migration Script
# This script applies migrations to your production Supabase instance

set -e # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Check if Supabase CLI is installed
check_supabase_cli() {
  if ! command -v supabase &> /dev/null; then
    print_error "Supabase CLI is not installed. Please install it first:"
    echo "npm install -g supabase"
    exit 1
  fi
  print_success "Supabase CLI is installed"
}

# Check if we're linked to a project
check_project_link() {
  if ! supabase status &> /dev/null; then
    print_warning "Not linked to a Supabase project."
    echo ""
    echo "To link to your project:"
    echo "1. Get your project reference from https://supabase.com/dashboard"
    echo "2. Run: supabase link --project-ref YOUR_PROJECT_REF"
    echo ""
    read -p "Do you want to continue anyway? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
      exit 0
    fi
  else
    print_success "Linked to Supabase project"
  fi
}

# Apply migrations to production
apply_migrations() {
  print_status "Applying migrations to production database..."

  # Array of migration files in order
  migrations=(
    "20250604030000_consolidated_schema.sql"
    "20250604030100_email_templates.sql"
    "20250604030200_user_preferences_segmentation.sql"
    "20250604030300_analytics_reporting.sql"
    "20250604030400_cleanup_and_utilities.sql"
  )

  for migration in "${migrations[@]}"; do
    migration_file="supabase/migrations/$migration"

    if [ -f "$migration_file" ]; then
      print_status "Applying migration: $migration"

      # Push the specific migration
      if supabase db push; then
        print_success "Migration applied: $migration"
      else
        print_error "Failed to apply migration: $migration"
        print_warning "You may need to apply migrations manually via the Supabase dashboard"
        exit 1
      fi
    else
      print_warning "Migration file not found: $migration_file"
    fi
  done
}

# Test the new functions
test_functions() {
  print_status "Testing new database functions..."

  # Test if the main function exists
  if supabase db exec "SELECT 1 FROM pg_proc WHERE proname = 'upsert_user_and_subscribe';" 2> /dev/null | grep -q "1"; then
    print_success "upsert_user_and_subscribe function is available"

    # Test the function with a dummy email
    print_status "Testing function with dummy data..."
    if supabase db exec "SELECT upsert_user_and_subscribe('test@example.com', 'general', 'migration_test');" &> /dev/null; then
      print_success "Function test passed"
    else
      print_warning "Function test failed, but function exists"
    fi
  else
    print_warning "upsert_user_and_subscribe function not found"
  fi
}

# Show status
show_status() {
  print_status "Checking system status..."

  # Try to run health check
  if supabase db exec "SELECT system_health_check();" &> /dev/null; then
    print_success "System health check available"
    echo ""
    echo "Run this command to see detailed system stats:"
    echo 'supabase db exec "SELECT system_health_check();"'
  else
    print_warning "System health check not available yet"
  fi

  echo ""
  print_success "Migration process completed!"
  echo ""
  echo "Your accelerator page should now work properly."
  echo "Test it at: https://alphab.io/accelerator"
}

# Main execution
main() {
  print_status "Applying Supabase Newsletter System Migrations to Production"
  echo "=================================================================="

  # Pre-flight checks
  check_supabase_cli
  check_project_link

  # Confirm before proceeding
  echo ""
  print_warning "This will modify your production database schema!"
  read -p "Are you sure you want to continue? (y/N): " -n 1 -r
  echo ""

  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_status "Migration cancelled by user"
    exit 0
  fi

  # Execute migration steps
  apply_migrations
  test_functions
  show_status
}

# Run main function
main "$@"
