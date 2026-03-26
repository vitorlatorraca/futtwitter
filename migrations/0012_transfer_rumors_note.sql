-- Migration 0012: Add note column to transfer_rumors (journalist observation/context)
ALTER TABLE transfer_rumors ADD COLUMN IF NOT EXISTS note text;
