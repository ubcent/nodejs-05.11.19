const mysql = require('mysql');

const pool = mysql.createPool({
  host: 'localhost',
  database: 'todo',
  user: 'root',
  password: '*****',
});

class Task {
  static getAll() {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if(err) {
          reject(err);
        }
  
        connection.query('SELECT * FROM `tasks` WHERE 1', (err, rawRows) => {
          if(err) {
            reject(err);
          }
          const rows = JSON.parse(JSON.stringify(rawRows));

          connection.release();
          resolve(rows);
        });
      });
    });
  }

  static update(id, task) {}

  static add(task) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if(err) {
          reject(err);
        }

        connection.query(
          'INSERT INTO `tasks` SET ?',
          task,
          (err, result) => {
            if(err) {
              reject(err);
            }

            resolve(result.insertId);
          }
        )
      });
    });
  }

  static complete(id) {}

  static delete(id) {}
}

module.exports = Task;