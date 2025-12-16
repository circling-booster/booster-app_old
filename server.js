require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { initializePool } = require('./config/database');
const authRoutes = require('./routes/auth');

const app = express();

// 미들웨어
app.use(helmet());
app.use(cors());
app.use(express.json());

// 라우트
app.use('/api/auth', authRoutes);

// 기본 상태 체크
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// 서버 시작
const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await initializePool();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Server startup error:', err);
    process.exit(1);
  }
}

start();
