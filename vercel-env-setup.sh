#!/bin/bash

# Load variables from .env file
if [ -f .env ]; then
  echo "Loading environment variables from .env file..."
  source .env
else
  echo "No .env file found."
  exit 1
fi

# Function to safely add environment variables to Vercel
add_env_var() {
  local name=$1
  local value=$2
  local environment=$3

  if [ -z "$value" ]; then
    echo "Skipping $name as it's empty..."
    return
  fi

  echo "Adding $name to Vercel..."
  
  # Using a temporary file to avoid shell history
  TMPFILE=$(mktemp)
  echo -n "$value" > "$TMPFILE"
  
  # Non-interactive mode for vercel env add
  vercel env add $name $environment < "$TMPFILE"
  
  # Clean up temp file
  rm "$TMPFILE"
  
  if [ $? -ne 0 ]; then
    echo "Failed to add $name to Vercel."
  else
    echo "$name added successfully to $environment."
  fi
}

echo "This script will add environment variables to Vercel."
echo "You will need to confirm each variable addition."

# Add production environment variables
add_env_var "OPENAI_API_KEY" "$OPENAI_API_KEY" "production"
add_env_var "GOOGLE_AI_API_KEY" "$GOOGLE_AI_API_KEY" "production"
add_env_var "ANTHROPIC_API_KEY" "$ANTHROPIC_API_KEY" "production"
add_env_var "CRON_SECRET_TOKEN" "$CRON_SECRET_TOKEN" "production"
add_env_var "BLOG_UPDATE_SCHEDULE" "$BLOG_UPDATE_SCHEDULE" "production"
add_env_var "SMTP_HOST" "$SMTP_HOST" "production"
add_env_var "SMTP_PORT" "$SMTP_PORT" "production"
add_env_var "SMTP_USER" "$SMTP_USER" "production"
add_env_var "SMTP_PASSWORD" "$SMTP_PASSWORD" "production"
add_env_var "SMTP_FROM_EMAIL" "$SMTP_FROM_EMAIL" "production"
add_env_var "ADMIN_EMAIL" "$ADMIN_EMAIL" "production"

echo "Environment variables setup complete."
echo "Now run: vercel --prod" 