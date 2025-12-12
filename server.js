const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

// JSON 요청 본문 파싱을 위한 미들웨어
app.use(express.json());
app.use(express.static('public'));

// 데이터베이스 연결 설정
const db = mysql.createPool({
  host: 'localhost',      // 데이터베이스 주소
  user: 'root',           // 데이터베이스 유저 이름
  password: 'password',   // 데이터베이스 비밀번호
  database: 'my_portfolio', // 데이터베이스 이름
  charset: 'utf8mb4'      // 한글/이모지 깨짐 방지 설정
});

// DB 연결 테스트
db.getConnection((err, connection) => {
  if (err) {
    console.error('Database connection failed:', err.message);
  } else {
    console.log('Successfully connected to the database!');
    connection.release();
  }
});

// 연락처 데이터 저장 API
app.post('/api/contact', (req, res) => {
  const { name, email, subject, content } = req.body;

  // 유효성 검사
  if (!name || !email || !subject || !content) {
    return res.status(400).json({ message: '모든 항목을 입력해주세요.' });
  }

  const query = 'INSERT INTO messages (name, email, subject, content) VALUES (?, ?, ?, ?)';
  
  db.query(query, [name, email, subject, content], (err, result) => {
    if (err) {
      console.error('Error saving message:', err);
      return res.status(500).json({ message: '메시지 저장 중 오류가 발생했습니다.' });
    }
    
    res.status(200).json({ message: '메시지가 성공적으로 전송되었습니다!', id: result.insertId });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
