require('./config/mysql');
const Crypto = require('crypto')

module.exports = async () => {

    function randomString(size = 21) {
        return Crypto
            .randomBytes(size)
            .toString('base64')
            .slice(0, size)
    }

    saveInDB = async (req, res) => {
        args = {
            name: req.body.appName,
            url: req.body.appUrl
        }
        var cID = randomString();
        var cSEC = randomString();
        var saveInDBsql = 'INSERT INTO applications (name, url, client_id, client_secret) VALUES (?,?,?,?)';
        var params = [args.name, args.url, cID, cSEC];
        await dbQuery(saveInDBsql, params, (err, rows) => {
            if (err) {
                console.log(err);
                return;
            } else {
                res.json(rows);
            }
        })
    }
}