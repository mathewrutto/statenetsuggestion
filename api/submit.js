import mysql from "mysql2/promise";

// Connect to the database
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, suggestion } = req.body;

  try {
    const connection = await pool.getConnection();
    await connection.execute(
      "INSERT INTO suggestions (name, email, suggestion) VALUES (?, ?, ?)",
      [name, email, suggestion]
    );
    connection.release();
    return res.status(200).json({ message: "Submission successful!" });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ error: "Database error" });
  }
}
