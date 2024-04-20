const mysql = require('mysql');

const Messages = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'water company'
});

const MessagesSchema = `
  CREATE TABLE IF NOT EXISTS Messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    location TEXT NOT NULL,
    messageContent TEXT NOT NULL,
    userId INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
  )
`;

Messages.query(MessagesSchema, (error, results, fields) => {
  if (error) {
    console.error('Error creating Messages table: ' + error.stack);
    return;
  }
});

module.exports = Messages;
