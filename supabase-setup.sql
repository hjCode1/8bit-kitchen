-- Run this in Supabase SQL Editor

-- App config table (for PIN storage)
CREATE TABLE IF NOT EXISTS app_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

ALTER TABLE app_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public access" ON app_config FOR ALL USING (true) WITH CHECK (true);

-- Ingredients table
CREATE TABLE IF NOT EXISTS ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  quantity TEXT,
  emoji TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public access" ON ingredients FOR ALL USING (true) WITH CHECK (true);

-- Recipe history table
CREATE TABLE IF NOT EXISTS recipe_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  ingredients_used JSONB NOT NULL DEFAULT '[]',
  steps JSONB NOT NULL DEFAULT '[]',
  cook_time TEXT,
  difficulty TEXT,
  servings TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE recipe_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public access" ON recipe_history FOR ALL USING (true) WITH CHECK (true);
