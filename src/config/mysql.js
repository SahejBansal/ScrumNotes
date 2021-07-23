const mysql = require("promise-mysql");
require('dotenv').config();
module.exports = async () => {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: process.env.MySQL_USERNAME,
        password: process.env.MySQL_PASSWORD,
        database: process.env.MySQL_DATABASE
    });

    const connection2 = await mysql.createConnection({
        host: 'localhost',
        user: process.env.MySQL_USERNAME,
        password: process.env.MySQL_PASSWORD,
        database: process.env.MySQL_DATABASE
    });

  global.dbQuery = async (query, params) => {
    // await connection.query(query, params, function (error, results, fields) {
    //     if (error) throw error;
    //     console.log('The solution is: ', results);
    //     return results;
    // });
    const result = connection.query(query, params);
    return result;
  };

  global.dbQuery2 = async (query, params) => {
    // await connection.query(query, params, function (error, results, fields) {
    //     if (error) throw error;
    //     console.log('The solution is: ', results);
    //     return results;
    // });
    const result = connection2.query(query, params);
    return result;
  };
};
