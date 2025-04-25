// Import required modules
import express from "express";
import cors from "cors";
import connection from "./connectToDb.js";
// Initialize express app
const app = express();
const PORT = 3000;
// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse incoming JSON requests

// Test route
const users = [];
let todos = [];
app.post("/login", async (req, res) => {
  const { password, username } = req.body;
  try {
    const [[user]] = await connection.query(
      "select * from users where username = ? AND password = ?",
      [username, password]
    );
    if (!user) {
      return res.status(404).json({ msg: "user not exists" });
    }
    res.status(201).json({ user });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Example POST route
app.post("/register", async (req, res) => {
  const { password, username } = req.body;
  try {
    const result = await connection.query(
      "insert into users(username , password) values(?,?)",
      [username, password]
    );
    console.log(result);
    const [[user]] = await connection.query(
      "select * from users where userId = ? ",
      [result[0].insertId]
    );
    console.log(user);
    res.status(201).json({ status: 201, user });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});
// Example POST route
app.post("/todos", async (req, res) => {
  const { userId, title } = req.body;
  try {
    if (!userId || !title) {
      return res.status(401).json({ msg: "invalid credentials" });
    }
    const [[find]] = await connection.query(
      "select * from users where userId = ? ",
      [userId]
    );
    if (!find) {
      return res.status(401).json({ msg: "user not exists" });
    }
    const result = await connection.query(
      "insert into todos(title , userId) values(?,?)",
      [title, userId]
    );
    const [[newTodo]] = await connection.query(
      "select * from todos where id = ?",
      [result[0].insertId]
    );
    res.status(201).json({ newTodo });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});
app.put("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  try {
    const [[todo]] = await connection.query(
      "select * from todos where id = ? ",
      [id]
    );
    if (!todo) {
      return res.status(404).json({ msg: "todo not exists" });
    }
    let result = null;
    if (title && title.length > 0) {
      result = await connection.query(
        "update todos set title = ? where id = ?",
        [title, id]
      );
      console.log(result);
    }
    if (completed != undefined) {
      result = await connection.query(
        "update todos set completed = ? where id = ?",
        [completed, id]
      );
      console.log(result);
    }
    res.status(201).json({ msg: "todo updated" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});
app.get("/todos/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const [todos] = await connection.query(
      "select * from todos where userId = ? ",
      [userId]
    );

    return res.status(200).json({ todos });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});
app.delete("/todos/:id", async(req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
 try {
    const result = await connection.query("delete from todos where id =  ? and userId = ?" , [id , userId])
    res.status(202).json({ msg: "todo deleted" });

 } catch (err) {
    res.status(500).json({ msg: err.message });

 }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
