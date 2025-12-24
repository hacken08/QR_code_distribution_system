
import path from "path";
import Database from 'better-sqlite3'

// const dbPath = path.join(process.cwd(), "db\\database.db");
const dbPath = path.join(process.cwd(), "db", "database.db");
export const db = new Database(dbPath);

