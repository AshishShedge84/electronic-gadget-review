#!/bin/bash
# Seed Database with realistic Gadget Reviews & initial NLP processing
cd "$(dirname "$0")/.."

echo "Seeding PostgreSQL Database with realistic Gadget Reviews..."
python3 data/seed_data.py
