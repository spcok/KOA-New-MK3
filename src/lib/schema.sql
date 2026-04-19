CREATE TABLE IF NOT EXISTS v3_animals (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  species TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  created_by UUID NOT NULL,
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS v3_daily_logs (
  id UUID PRIMARY KEY,
  animal_id UUID REFERENCES v3_animals(id),
  log_text TEXT NOT NULL,
  log_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  created_by UUID NOT NULL,
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE OR REPLACE VIEW v3_readable_logs AS
SELECT 
  l.id AS log_id,
  a.id AS animal_id,
  a.name AS animal_name,
  a.species,
  l.log_text,
  l.log_date,
  l.created_at AS log_created_at,
  l.created_by AS log_created_by
FROM v3_daily_logs l
JOIN v3_animals a ON l.animal_id = a.id
WHERE l.is_deleted = FALSE AND a.is_deleted = FALSE;
