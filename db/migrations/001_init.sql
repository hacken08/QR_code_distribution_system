

PRAGMA foreign_keys = OFF;
BEGIN TRANSACTION;

-- renaming old tables
-- ALTER TABLE products RENAME to products_old;
-- ALTER TABLE qrcodes RENAME to qrcodes_old;


CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_code INTEGER NOT NULL,
    product_name TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_at TEXT DEFAULT NULL,
    updated_at TEXT DEFAULT NULL
);


CREATE TABLE qrcodes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    -- product_name TEXT NOT NULL,           
    product_id INTEGER NOT NULL,                  
    item_code INTEGER NOT NULL,
    batch_no INTEGER NOT NULL,
    qrcode_string TEXT NOT NULL,
    product_name TEXT NOT NULL,
    points INTEGER NOT NULL,
    is_used INTEGER NOT NULL DEFAULT 0,          
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_at TEXT DEFAULT NULL,
    updated_at TEXT DEFAULT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);


-- migrating data into new data tables
-- INSERT INTO products (id, item_code, product_name, created_at, deleted_at, updated_at)
-- SELECT id, item_code, product_name, created_at, deleted_at, updated_at
-- FROM products_old;

-- Copy qrcodes (this fixes product_id if it was empty or wrong)
-- INSERT INTO qrcodes (
--     id, product_id, item_code, batch_no, qrcode_string, points,
--     is_used, created_at, deleted_at, updated_at
-- )
-- SELECT 
--     q.id,
--     -- Fix product_id: find correct product by item_code
--     COALESCE(
--       (SELECT p.id FROM products p WHERE p.item_code = q.item_code LIMIT 1),
--       (SELECT MIN(id) FROM products)  -- fallback if not found
--     ) AS product_id,
--     q.item_code,
--     q.batch_no,
--     q.qrcode_string,
--     q.points,
--     q.is_used,
--     q.created_at,
--     q.deleted_at,
--     q.updated_at
-- FROM qrcodes_old q;


-- Droping old tables
-- DROP TABLE products_old;
-- DROP TABLE qrcodes_old;

-- -- Re enabling 
PRAGMA foreign_keys = ON;
PRAGMA foreign_key_check;
COMMIT;