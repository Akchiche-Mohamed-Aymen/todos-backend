import mysql from "mysql2/promise";


let connection = await mysql.createConnection("mysql://root:PmPqytlFIpkPMYeQJnKfNDtcOWkoBMyW@shuttle.proxy.rlwy.net:59753/railway")

try {
  await connection.connect();
  console.log("success to connect to TODOLIST DB");
} catch (err) {
  console.error("❌ Failed to connect err =>  :", err.message);
  connection = null;
}

export default connection;
