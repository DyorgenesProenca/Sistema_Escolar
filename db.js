import mysql from 'mysql2/promise';
import 'dotenv/config'; // Carrega as variáveis do arquivo .env automaticamente

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Testar a conexão ao iniciar a aplicação
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conexão com o MySQL realizada com sucesso!');
    connection.release(); // Libera a conexão de volta para o pool
  } catch (error) {
    console.error('❌ Erro ao conectar no MySQL:', error.message);
  }
})();

export default pool;
