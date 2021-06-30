const mysql = require("promise-mysql");
module.exports = async () => {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'etherpad',
        password: 'etherpad',
        database: 'etherpad'
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
};
