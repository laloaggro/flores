#!/bin/bash

# Deployment script for Arreglos Victoria Florería

echo "Starting deployment process..."

# Check if we're on the correct branch
BRANCH=$(git branch --show-current)
echo "Current branch: $BRANCH"

if [ "$BRANCH" != "improvements" ]; then
  echo "Switching to improvements branch"
  git checkout improvements
fi

# Add all changes
echo "Adding all changes..."
git add .

# Commit changes if there are any
echo "Checking for changes..."
if ! git diff-index --quiet HEAD --; then
  echo "Committing changes..."
  git commit -m "Automated deployment commit"
else
  echo "No changes to commit"
fi

# Push to remote repository
echo "Pushing to remote repository..."
git push origin improvements

echo "Deployment process completed!"
echo "To deploy to production, merge the improvements branch into main and push to origin."