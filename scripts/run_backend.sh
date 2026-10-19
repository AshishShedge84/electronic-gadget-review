#!/bin/bash
# Run Flask REST API Backend
cd "$(dirname "$0")/../backend"

echo "Starting Electronic Gadget Review Summarizer API Backend..."
python3 run.py
