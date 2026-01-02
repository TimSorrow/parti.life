#!/bin/bash
# Test SSH connection to GitHub
echo "Testing SSH connection to GitHub..."
echo ""

ssh -T git@github.com 2>&1 | grep -q "successfully authenticated" && echo "✓ SSH connection successful!" || echo "❌ SSH connection failed. Make sure you've added your SSH key to GitHub."
