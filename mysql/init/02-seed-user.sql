USE dictate_english;

INSERT IGNORE INTO users (id, email, password_hash, created_at, updated_at)
VALUES (
  1,
  'test@example.com',
  '\$2b\$10\$K8gN5P6L9M2Q3R4S5T6U7V8W9X0Y1Z2A3B4C5D6E7F8G9H0I1J2K3',
  NOW(),
  NOW()
);
