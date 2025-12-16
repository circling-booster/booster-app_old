const sql = require('mssql');
require('dotenv').config();

const config = {
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  authentication: {
    // Microsoft Entra 인증 사용
    type: 'azure-active-directory-default',
    // 또는: 'azure-active-directory-msi-app-service' (Azure Web App)
    // 또는: 'azure-active-directory-msi-vm' (Azure VM)
  },
  options: {
    encrypt: true,
    trustServerCertificate: false,
    connectTimeout: 30000
  }
};

let pool;

async function initializePool() {
  try {
    pool = new sql.ConnectionPool(config);
    await pool.connect();
    console.log('Database connected with Microsoft Entra authentication');
    return pool;
  } catch (err) {
    console.error('Database connection error:', err);
    throw err;
  }
}

module.exports = { initializePool };
