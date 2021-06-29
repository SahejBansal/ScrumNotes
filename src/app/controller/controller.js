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
        // var getSavedsql = `SELECT * FROM applications WHERE name=?`;
        // const result2 = await dbQuery(getSavedsql, [args.name]);
        // response = JSON.parse(JSON.stringify(result2))
        // vals = response[0];
        if (!result || result == null) {
            console.log(err);
        } else {
            data = {
                cID: cID,
                cSEC: cSEC,
                id: result.insertId
            }
            console.log("success");
            res.send(data);
        }
    },

    async TokenGen(req, res) {
        args = {
            cID: req.body.cID,
            cSEC: req.body.cSEC,
            email: req.body.email,
            name: req.body.name
        }
        var AppExistInDBsql = 'SELECT * FROM applications WHERE client_id=? and client_secret=?';
        var params = [args.cID, args.cSEC];
        const result = await dbQuery(AppExistInDBsql, params);
        response = JSON.parse(JSON.stringify(result))
        if (!result || result == null) {
            console.log(err);
        } else {
            var token = randomString(21);
            var appId = response[0].application_id;
            var saveTokenInAppUserssql = 'INSERT INTO user_applications (application_id, token) VALUES (?,?)';
            var params2 = [appId, token]
            const result2 = await dbQuery(saveTokenInAppUserssql, params2);
            if (!result2 || result2 == null) {
                console.log(err);
            } else {
                
                data = {
                    user_id: result2.insertId,
                    application_id: appId,
                    token: token
                }
                console.log("success");
                res.send(data);
            }
        }
    }
}