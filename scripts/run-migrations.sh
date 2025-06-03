#!/bin/bash

# Supabase Migration Execution Script
# This script runs the newsletter system migrations in the correct order

set -e # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SUPABASE_PROJECT_REF=${SUPABASE_PROJECT_REF:-""}
SUPABASE_DB_PASSWORD=${SUPABASE_DB_PASSWORD:-""}

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

# Function to check if Supabase CLI is installed
check_supabase_cli() {
  if ! command -v supabase &> /dev/null; then
    print_error "Supabase CLI is not installed. Please install it first:"
    echo "npm install -g supabase"
    exit 1
  fi
  print_success "Supabase CLI is installed"
}

# Function to check if we're in a Supabase project
check_supabase_project() {
  if [ ! -f "supabase/config.toml" ]; then
    print_error "Not in a Supabase project directory. Please run 'supabase init' first."
    exit 1
  fi
  print_success "Supabase project detected"
}

# Function to start local Supabase if needed
start_local_supabase() {
  print_status "Checking Supabase local development status..."

  if ! supabase status &> /dev/null; then
    print_status "Starting local Supabase development environment..."
    supabase start
    print_success "Local Supabase started"
  else
    print_success "Local Supabase is already running"
  fi
}

# Function to backup existing migrations
backup_old_migrations() {
  print_status "Backing up existing migrations..."

  if [ -d "supabase/migrations" ]; then
    # Create backup directory with timestamp
    backup_dir="supabase/migrations_backup_$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$backup_dir"

    # Copy old migrations (excluding our new ones)
    for file in supabase/migrations/*.sql; do
      if [[ -f $file && ! $file =~ 20250604030[0-9]{3}_ ]]; then
        cp "$file" "$backup_dir/"
        print_status "Backed up: $(basename "$file")"
      fi
    done

    print_success "Old migrations backed up to: $backup_dir"
  fi
}

# Function to run migrations
run_migrations() {
  print_status "Running newsletter system migrations..."

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
      print_status "Running migration: $migration"

      # Apply the migration
      if supabase db push; then
        print_success "Migration applied: $migration"
      else
        print_error "Failed to apply migration: $migration"
        exit 1
      fi
    else
      print_warning "Migration file not found: $migration_file"
    fi
  done
}

# Function to verify migrations
verify_migrations() {
  print_status "Verifying migration results..."

  # Check if key tables exist
  tables=(
    "user"
    "newsletter"
    "email_templates"
    "email_campaigns"
    "email_sends"
    "user_preferences"
    "user_segments"
    "analytics_events"
    "daily_analytics"
  )

  for table in "${tables[@]}"; do
    if supabase db exec "SELECT 1 FROM $table LIMIT 1;" &> /dev/null; then
      print_success "Table verified: $table"
    else
      print_error "Table not found or accessible: $table"
    fi
  done

  # Check if key functions exist
  functions=(
    "upsert_user_and_subscribe"
    "track_analytics_event"
    "get_subscription_stats"
    "system_health_check"
  )

  for func in "${functions[@]}"; do
    if supabase db exec "SELECT 1 FROM pg_proc WHERE proname = '$func';" | grep -q "1"; then
      print_success "Function verified: $func"
    else
      print_error "Function not found: $func"
    fi
  done
}

# Function to run system health check
run_health_check() {
  print_status "Running system health check..."

  if supabase db exec "SELECT system_health_check();" &> /dev/null; then
    print_success "System health check passed"
    print_status "You can run 'SELECT system_health_check();' in your database to see detailed stats"
  else
    print_warning "System health check function not available yet"
  fi
}

# Function to show next steps
show_next_steps() {
  print_success "Migration completed successfully!"
  echo ""
  echo "Next steps:"
  echo "1. Review the SUPABASE_SCHEMA_DOCUMENTATION.md file for detailed schema information"
  echo "2. Test the system with sample data:"
  echo "   SELECT * FROM upsert_user_and_subscribe('test@example.com', 'general', 'test');"
  echo "3. Check system status:"
  echo "   SELECT * FROM system_health_check();"
  echo "4. View subscription statistics:"
  echo "   SELECT * FROM get_subscription_stats();"
  echo "5. Configure your application to use the new schema"
  echo ""
  echo "For production deployment:"
  echo "1. Set your Supabase project reference: export SUPABASE_PROJECT_REF=your-project-ref"
  echo '2. Link to your project: supabase link --project-ref $SUPABASE_PROJECT_REF'
  echo "3. Push to production: supabase db push"
}

# Main execution
main() {
  print_status "Starting Supabase Newsletter System Migration"
  echo "=============================================="

  # Pre-flight checks
  check_supabase_cli
  check_supabase_project

  # Ask for confirmation
  echo ""
  print_warning "This will modify your database schema. Make sure you have a backup!"
  read -p "Do you want to continue? (y/N): " -n 1 -r
  echo ""

  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_status "Migration cancelled by user"
    exit 0
  fi

  # Execute migration steps
  backup_old_migrations
  start_local_supabase
  run_migrations
  verify_migrations
  run_health_check
  show_next_steps

  print_success "All done! Your newsletter system is ready to use."
}

# Run main function
main "$@"
