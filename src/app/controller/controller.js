const Crypto = require('crypto')

function randomString(size) {
    return Crypto
        .randomBytes(size)
        .toString('base64')
        .slice(0, size)
}

module.exports = {
    async saveInDB(req, res) {
        args = {
            name: req.body.appName,
            url: req.body.appUrl
        }
        var cID = randomString(21);
        var cSEC = randomString(21);
        var saveInDBsql = 'INSERT INTO applications (name, url, client_id, client_secret) VALUES (?,?,?,?)';
        var params = [args.name, args.url, cID, cSEC];
        const result = await dbQuery(saveInDBsql, params);
        var getSavedsql = `SELECT * FROM applications WHERE name=?`;
        const result2 = await dbQuery(getSavedsql, [args.name]);
        response = JSON.parse(JSON.stringify(result2))
        vals = response[0];
        if (!result || result == null) {
            console.log(err);
        } else {
            data = {
                cID: cID,
                cSEC: cSEC,
                vals
            }
            console.log(vals);
            console.log("success");
            res.send(data);
        }
    }
}