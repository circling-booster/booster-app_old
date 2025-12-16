const express = require('express');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const { executeQuery, sql } = require('../config/database');
const router = express.Router();

// 회원가입
router.post('/signup', async (req, res) => {
  try {
    const { email, username, password, fullName, phoneNumber } = req.body;

    // 입력값 검증
    if (!email || !username || !password) {
      return res.status(400).json({ error: '필수 필드 누락' });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: '유효한 이메일 형식이 아닙니다' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: '비밀번호는 최소 8자 이상이어야 합니다' });
    }

    // 중복 확인
    const checkDuplicate = `
      SELECT COUNT(*) as count FROM [dbo].[Users] 
      WHERE Email = @email OR Username = @username
    `;
    const result = await executeQuery(checkDuplicate, {
      email: sql.NVarChar(255),
      username: sql.NVarChar(100)
    });

    if (result.recordset[0].count > 0) {
      return res.status(409).json({ error: '이미 사용 중인 이메일 또는 사용자명입니다' });
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    // 사용자 생성
    const insertQuery = `
      INSERT INTO [dbo].[Users] (Email, Username, PasswordHash, FullName, PhoneNumber)
      VALUES (@email, @username, @passwordHash, @fullName, @phoneNumber)
    `;

    await executeQuery(insertQuery, {
      email: email,
      username: username,
      passwordHash: hashedPassword,
      fullName: fullName || null,
      phoneNumber: phoneNumber || null
    });

    res.status(201).json({ message: '회원가입이 완료되었습니다' });

  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: '서버 오류가 발생했습니다' });
  }
});

module.exports = router;
