const mysql = require('mysql2/promise');

const connection = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'Expenses_Mangement',
        waitForConnections: true,
        connectionLimit: 50,
        queueLimit: 0
});

module.exports=connection;