const sql = require('mssql');
require('dotenv').config();

async function testConnection() {
  const config = {
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    authentication: {
      type: 'azure-active-directory-default'
    },
    options: {
      encrypt: true,
      trustServerCertificate: false,
      connectTimeout: 30000
    }
  };

  try {
    console.log('🔄 데이터베이스 연결 시도 중...');
    console.log(`서버: ${process.env.DB_SERVER}`);
    console.log(`데이터베이스: ${process.env.DB_NAME}`);
    
    const pool = new sql.ConnectionPool(config);
    await pool.connect();
    
    console.log('✅ 데이터베이스 연결 성공!');
    
    // 간단한 쿼리 실행
    const result = await pool.request().query('SELECT TOP 1 * FROM INFORMATION_SCHEMA.TABLES');
    console.log('✅ 쿼리 실행 성공!');
    console.log(`테이블 수: ${result.recordset.length}`);
    
    // Users 테이블 확인
    const usersTable = await pool.request().query(
      `SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Users'`
    );
    
    if (usersTable.recordset.length > 0) {
      console.log('✅ Users 테이블 존재 확인!');
    } else {
      console.log('⚠️ Users 테이블이 없습니다. 생성이 필요합니다.');
    }
    
    await pool.close();
    console.log('✅ 연결 종료 성공!');
    
  } catch (err) {
    console.error('❌ 연결 실패!');
    console.error('에러 메시지:', err.message);
    console.error('에러 상세:', err);
    process.exit(1);
  }
}

testConnection();
