import sqlite3 from "sqlite3";
import { open } from "sqlite";

const initDb = async () => {
  const db = await open({
    filename: "./db/users.db",
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT NOT NULL
    );
  `);

  console.log("Database initialized");
};

initDb().catch((err) => {
  console.error(err);
});
