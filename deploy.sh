#!/bin/bash
# Deploy Legacy Capital VIP to GitHub Pages or static host

cd /Users/smartysboys/.openclaw/workspace/vip-website

# Create a clean deploy directory
rm -rf deploy
mkdir deploy

# Copy all files
cp -r *.html *.css *.js *.png *.jpg deploy/ 2>/dev/null

# Start a fresh server on a different port
python3 -m http.server 9999 --directory deploy &
echo "Server running on http://localhost:9999"
echo "Files ready for deployment"
