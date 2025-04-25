import mysql from "mysql2/promise";

let connection = await mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "todolist",
});

try {
  await connection.connect();
  console.log("success to connect to TODOLIST DB");
} catch (err) {
  console.error("❌ Failed to connect err =>  :", err.message);
  connection = null;
}

export default connection;
