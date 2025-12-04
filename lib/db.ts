
import path from "path";
import Database from 'better-sqlite3'

const dbPath = path.join(process.cwd(), "db", "database.db");

// open sqlite database
export const db = new Database(dbPath);

