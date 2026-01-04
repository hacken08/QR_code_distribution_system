PRAGMA foreign_keys = OFF;
BEGIN TRANSACTION;

-- Rename old tables
ALTER TABLE products RENAME TO products_old;
ALTER TABLE qrcodes RENAME TO qrcodes_old;

-- Recreate products table
CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_code INTEGER NOT NULL,
    product_name TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_at TEXT DEFAULT NULL,
    updated_at TEXT DEFAULT NULL
);

-- Recreate qrcodes table with UNIQUE constraint
CREATE TABLE qrcodes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    item_code INTEGER NOT NULL,
    batch_no INTEGER NOT NULL,
    qrcode_string TEXT NOT NULL UNIQUE,
    product_name TEXT NOT NULL,
    points INTEGER NOT NULL,
    is_used INTEGER NOT NULL DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_at TEXT DEFAULT NULL,
    updated_at TEXT DEFAULT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Migrate products
INSERT INTO products (id, item_code, product_name, created_at, deleted_at, updated_at)
SELECT id, item_code, product_name, created_at, deleted_at, updated_at
FROM products_old;

-- Copy qrcodes (fixes product_id if empty or wrong)
INSERT OR IGNORE INTO qrcodes (
    id,
    product_id,
    item_code,
    batch_no,
    qrcode_string,
    product_name,
    points,
    is_used,
    created_at,
    deleted_at,
    updated_at
)
SELECT 
    q.id,
    COALESCE(
        (SELECT p.id FROM products p WHERE p.item_code = q.item_code LIMIT 1),
        (SELECT MIN(id) FROM products)
    ) AS product_id,
    q.item_code,
    q.batch_no,
    q.qrcode_string,
    q.product_name,
    q.points,
    q.is_used,
    q.created_at,
    q.deleted_at,
    q.updated_at
FROM qrcodes_old q;

-- Drop old tables
DROP TABLE qrcodes_old;
DROP TABLE products_old;

PRAGMA foreign_keys = ON;
PRAGMA foreign_key_check;
COMMIT;
