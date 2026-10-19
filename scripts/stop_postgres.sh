#!/bin/bash
# Stop PostgreSQL for Gadget Review Summarizer PBL
PGDATA_DIR="/Users/ashishmac/Downloads/Projects/PBL/backend/pg_data"
PG_BIN="/Library/PostgreSQL/18/bin"

if [ -f "$PG_BIN/pg_ctl" ]; then
    "$PG_BIN/pg_ctl" -D "$PGDATA_DIR" stop
else
    pg_ctl -D "$PGDATA_DIR" stop
fi
