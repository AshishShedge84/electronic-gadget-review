#!/bin/bash
# Start PostgreSQL for Gadget Review Summarizer PBL
PGDATA_DIR="/Users/ashishmac/Downloads/Projects/PBL/backend/pg_data"
PG_BIN="/Library/PostgreSQL/18/bin"

if [ -f "$PG_BIN/pg_ctl" ]; then
    echo "Starting PostgreSQL cluster on port 5433..."
    "$PG_BIN/pg_ctl" -D "$PGDATA_DIR" -o "-p 5433" -l "$PGDATA_DIR/server.log" start
else
    echo "PostgreSQL bin not found at $PG_BIN. Trying system pg_ctl..."
    pg_ctl -D "$PGDATA_DIR" -o "-p 5433" -l "$PGDATA_DIR/server.log" start
fi
