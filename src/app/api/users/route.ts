import { NextApiRequest, NextApiResponse } from "next";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

const openDb = async () => {
  return open({
    filename: "./db/users.db",
    driver: sqlite3.Database,
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const db = await openDb();

  switch (req.method) {
    case "GET":
      try {
        const users = await db.all("SELECT * FROM users");
        res.status(200).json(users);
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch users" });
      }
      break;

    case "POST":
      try {
        const { username, email } = req.body;
        await db.run("INSERT INTO users (username, email) VALUES (?, ?)", [
          username,
          email,
        ]);
        res.status(201).json({ message: "User added" });
      } catch (error) {
        res.status(500).json({ error: "Failed to add user" });
      }
      break;

    case "PUT":
      try {
        const { id, updatedUsername, updatedEmail } = req.body;
        await db.run("UPDATE users SET username = ?, email = ? WHERE id = ?", [
          updatedUsername,
          updatedEmail,
          id,
        ]);
        res.status(200).json({ message: "User updated" });
      } catch (error) {
        res.status(500).json({ error: "Failed to update user" });
      }
      break;

    case "DELETE":
      try {
        const { userId } = req.body;
        await db.run("DELETE FROM users WHERE id = ?", [userId]);
        res.status(200).json({ message: "User deleted" });
      } catch (error) {
        res.status(500).json({ error: "Failed to delete user" });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
