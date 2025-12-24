import fs from "fs";
import { db } from "./db.ts";
import path from "path";

// const filePath = `${process.cwd()}\\db\\migrations\\001_init.sql`
const filePath = path.join(process.cwd(), "db", "migrations", "001_init.sql");
const sql = fs.readFileSync(filePath, "utf8");

console.log("SQL Query -> ", sql)

try {
  db.exec(`${sql}`);
  console.log("Migration successful!");
} catch (err) {
  console.error("Migration failed:", err);
}

