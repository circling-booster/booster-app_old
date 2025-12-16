const sql = require('mssql');
require('dotenv').config();

let pool;

async function initializePool() {
  try {
    // 환경변수 검증
    if (!process.env.DB_SERVER) {
      throw new Error('DB_SERVER 환경변수가 설정되지 않았습니다.');
    }
    if (!process.env.DB_NAME) {
      throw new Error('DB_NAME 환경변수가 설정되지 않았습니다.');
    }

    const config = {
      server: process.env.DB_SERVER,
      database: process.env.DB_NAME,
      authentication: {
        type: 'azure-active-directory-msi-app-service'
      },
      options: {
        encrypt: process.env.DB_ENCRYPT === 'true' || true,
        trustServerCertificate: process.env.DB_TRUST_CERT === 'true' || false,
        connectTimeout: 30000
      }
    };

    pool = new sql.ConnectionPool(config);
    await pool.connect();
    console.log('✓ 데이터베이스 연결 성공 (Microsoft Entra 인증)');
    return pool;
  } catch (err) {
    console.error('✗ 데이터베이스 연결 오류:', err.message);
    throw err;
  }
}

function getPool() {
  if (!pool) throw new Error('데이터베이스 풀이 초기화되지 않았습니다.');
  return pool;
}

module.exports = { initializePool, getPool };
