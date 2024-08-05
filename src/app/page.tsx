"use client";

import { useState, useEffect } from "react";
import axios from "axios";

interface User {
  id: number;
  username: string;
  email: string;
}

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get<User[]>("/api/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const addUser = async () => {
    try {
      await axios.post("/api/users", { username, email });
      setUsername("");
      setEmail("");
      fetchUsers();
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const deleteUser = async (id: number) => {
    try {
      await axios.delete("/api/users", { data: { userId: id } });
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const editUser = async () => {
    if (editingUser) {
      try {
        await axios.put("/api/users", {
          id: editingUser.id,
          updatedUsername: username,
          updatedEmail: email,
        });
        setUsername("");
        setEmail("");
        setEditingUser(null);
        fetchUsers();
      } catch (error) {
        console.error("Error updating user:", error);
      }
    } else {
      console.error("No user is currently being edited.");
    }
  };

  return (
    <div>
      <h1>User Management</h1>
      <div>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {editingUser ? (
          <button onClick={editUser}>Update User</button>
        ) : (
          <button onClick={addUser}>Add User</button>
        )}
      </div>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.username} - {user.email}
            <button onClick={() => deleteUser(user.id)}>Delete</button>
            <button
              onClick={() => {
                setEditingUser(user);
                setUsername(user.username);
                setEmail(user.email);
              }}
            >
              Edit
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
