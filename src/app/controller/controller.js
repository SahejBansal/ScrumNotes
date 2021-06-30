const Crypto = require("crypto");
const { exists } = require("fs");

// api = require('etherpad-lite-client')
// etherpad = api.connect({
//     apikey: '308c704c36b41c846ba1713a59f92c6a9707ced910894de32070287a03bfcb68',
//     host: 'localhost',
//     port: 9001,
// });

// api = require('etherpad-lite-client')
// etherpad = api.connect({
//     apikey: '308c704c36b41c846ba1713a59f92c6a9707ced910894de32070287a03bfcb68',
//     host: 'localhost',
//     port: 9001,
// });

function randomString(size) {
    return Crypto.randomBytes(size).toString("base64").slice(0, size);
}

// function addUserToEtherpad(userName) {
//     let author = etherpad.createAuthorIfNotExistsFor(userName, null);
//     if (author === null)
//         throw new customError("there was an error creating user", "ep_maadix");
//     return author;
// }

async function TokenGen(cID, cSEC, cb) {
    var AppExistInDBsql = 'SELECT * FROM applications WHERE client_id=? and client_secret=?';
    var params = [cID, cSEC];
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
        cb(token);
    }
}



async function getAppId(cID, cSEC) {
    var AppExistInDBsql = 'SELECT * FROM applications WHERE client_id=? and client_secret=?';
    var params = [cID, cSEC];
    const result = await dbQuery(AppExistInDBsql, params);
    if (!result || result == null) {
        console.log("Error fetching App Id");
        return null;
    } else {
        response = JSON.parse(JSON.stringify(result));
        var appId = response[0].application_id;
        return appId;
    }
}

async function userExists(name, email) {
    userApplicationExistsSql = 'select user.userId, user.email, user.name from user INNER JOIN user_applications on user.userID = user_applications.user_id'
    userExistsSql = 'SELECT * FROM user WHERE name = ? OR email = ?';
    var userExistsSqlParams = [name, email]
    var userExistsQuery = await dbQuery(userExistsSql, userExistsSqlParams)
    var userApplicationExistsQuery = await dbQuery(userApplicationExistsSql)
    // console.log(userExistsQuery)
    // console.log(userApplicationExistsQuery)
    if (Object.keys(userExistsQuery).length === 0) {
        // console.log("false");
        return false;

    } else {

        // console.log("true")
        return true;
    }


}

var userAuthenticated = function (req, cb) {
    log('debug', 'userAuthenticated');
    if (req.body.token) {
        cb(true);
    } else {
        cb(false);
    }
};

// function addUserToEtherpad(userName) {
//     let author = etherpad.createAuthorIfNotExistsFor(userName, null);
//     if (author === null)
//         throw new customError("there was an error creating user", "ep_maadix");
//     return author;
// }

async function TokenGen(cID, cSEC, cb) {
    var AppExistInDBsql = 'SELECT * FROM applications WHERE client_id=? and client_secret=?';
    var params = [cID, cSEC];
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
        cb(token);
    }
}

async function existValueInDatabase(sql, params, cb) {
    var result = await dbQuery(sql, params)
    if (!result || result == null) {
        log('error', 'existValueInDatabase error, sql: ' + sql);
        cb(false);
    } else {
        cb(true);
    }
}

async function getOneValueSql(sql, params, cb) {
    log('debug', 'getOneValueSql');
    var result = await dbQuery(sql, params)
    if (!result || result == null) {
        log('error', 'getOneValueSql error, sql: ' + sql);
        cb(false);
    } else {
        cb(true);
    }
}

function getAppId(cID, cSEC) {
    var AppExistInDBsql = 'SELECT * FROM applications WHERE client_id=? and client_secret=?';
    var params = [cID, cSEC];
    const result = await dbQuery(AppExistInDBsql, params);
    if (!result || result == null) {
        console.log("Error fetching App Id");
        return null;
    } else {
        response = JSON.parse(JSON.stringify(result));
        var appId = response[0].application_id;
        return appId;
    }
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

    // async TokenGen(req, res) {
    //     args = {
    //         cID: req.body.cID,
    //         cSEC: req.body.cSEC,
    //         email: req.body.email,
    //         name: req.body.name
    //     }
    //     var AppExistInDBsql = 'SELECT * FROM applications WHERE client_id=? and client_secret=?';
    //     var params = [args.cID, args.cSEC];
    //     const result = await dbQuery(AppExistInDBsql, params);
    //     response = JSON.parse(JSON.stringify(result))
    //     if (!result || result == null) {
    //         console.log(err);
    //     } else {
    //         var token = randomString(21);
    //         var appId = response[0].application_id;
    //         var saveTokenInAppUserssql = 'INSERT INTO user_applications (application_id, token) VALUES (?,?)';
    //         var params2 = [appId, token]
    //         const result2 = await dbQuery(saveTokenInAppUserssql, params2);
    //         if (!result2 || result2 == null) {
    //             console.log(err);
    //         } else {

    //             data = {
    //                 user_id: result2.insertId,
    //                 application_id: appId,
    //                 token: token
    //             }
    //             console.log("success");
    //             res.send(data);
    //         }
    //     }
    // }

    async RegisterUser(req, res) {


        args = {
            name: req.body.name,
            email: req.body.email,

        }
        const emailRegex = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/

        if (emailRegex.test(args.email)) {
            registerUserSql = 'INSERT INTO user(name,email) VALUES(?,?)'
            var params = [args.name, args.email]
            const verifyUserExists = await userExists(args.name, args.email)

            if (!verifyUserExists) {
                var registerUserQuery = await dbQuery(registerUserSql, params)
                res.send(registerUserQuery)
            } else {
                // console.log("User already exists")
                res.send("User already exists")
            }




        } else {
            res.send("Invalid Email")
        }
        // new formidable.IncomingForm().parse(req, function (err, fields) {
        //     userEmail = fields.userEmail;
        //     userName = fields.name;
        //     cID = req.body.cID;
        //     cSEC = req.body.cSEC;
        //     var AppId = getAppId(cID, cSEC);
        //     var Ergebnis = userEmail.toString().match(/[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+.[a-zA-Z]{2,4}/);
        //     if (Ergebnis == null) {
        //         sendError('Email is not valid!', res);
        //         return
        //     }
        //     var existUser = "SELECT * from user where etherpad.user.email = ? and user.appId = ?";
        //     existValueInDatabase(existUser, [userEmail, appId], function (exists) {
        //         if (exists) {
        //             sendError('An account already exists with this Email address', res);
        //             return

        //         } else {
        //             var addUserSql = "";
        //             TokenGen(req.body.cID, req.body.SEC, async function (token) {
        //                 // columns: userID, name, email, token, appId, confirmed, active
        //                 addUserSql = "INSERT INTO user VALUES(null,?, ?, ?, ? ,null ,?, ?, 0)";
        //                 var newUser = await dbQuery(addUserSql, [userName, userEmail, token, appId]);
        //                 if (newUser) {
        //                     let mappedUser = addUserToEtherpad(newUser.insertId);
        //                     var data = {};
        //                     data.success = true;
        //                     data.error = false;
        //                     data.token = token
        //                     res.send(data);
        //                 }
        //                 // addUserQuery.on('error', mySqlErrorHandler);
        // addUserQuery.on('result', function (newUser) {
        //     connection.pause();
        //     //addUserToEtherpad(newUser.insertId, function (cb) {
        //     let mappedUser = addUserToEtherpad(newUser.insertId);
        // });
        // addUserQuery.on('end', function () {
        //     var data = {};
        //     data.success = true;
        //     data.error = false;
        //     res.send(data);
        //     //cb(true);
        // });
        // })
        // createSalt(function (salt) {
        //     getPassword(function (consString) {
        //         /* Fields in User table are:userID, name, email, password, confirmed, FullName, confirmationString, salt, active*/
        //         addUserSql = "INSERT INTO User VALUES(null,?, ?,null, 0 ,null ,?, ?, 0)";
        //         var addUserQuery = connection.query(addUserSql, [userEmail, userEmail, consString, salt]);
        //         addUserQuery.on('error', mySqlErrorHandler);
        //         addUserQuery.on('result', function (newUser) {
        //             connection.pause();
        //             //addUserToEtherpad(newUser.insertId, function (cb) {
        //             let mappedUser = addUserToEtherpad(newUser.insertId);
        //         });
        //         addUserQuery.on('end', function () {
        //             var data = {};
        //             data.success = true;
        //             data.error = false;
        //             res.send(data);
        //             //cb(true);
        //         });
        //     });
        // });
    },

    //still working on the queries and table structuring for this
    async createGroup(req, res) {
        userAuthenticated(req, function (authenticated) {
            var data = {};
            if (authenticated) {
                if (!fields.groupName) {
                    sendError("Group Name not defined", res);
                    return;
                }
                var existGroupSql = "SELECT * from Groups WHERE Groups.name = ?";
                getOneValueSql(existGroupSql, [fields.groupName], function (found) {
                    if (found) {
                        sendError('Group already exists', res);
                        return;
                    } else {
                        var addGroupSql = "INSERT INTO Groups VALUES(null, ?)";
                        var group = await dbQuery(addGroupSql, [fields.groupName]);
                        data.groupid = group.insertId;
                        var addUserGroupSql = "INSERT INTO UserGroup Values(?,?,1)";
                        var addUserGroupQuery = await dbQuery(addUserGroupSql, [req.session.userId, group.insertId]);
                        if (addUserGroupQuery) {
                            etherpad.createGroupIfNotExistsFor(group.insertId.toString(), function (err, val) {
                                if (err) {
                                    log('error', 'failed to createGroupIfNotExistsFor');
                                } else {
                                    data.success = true;
                                    data.error = null;
                                    res.send(data);
                                }
                            });
                        } else {
                            res.send("error addusergroupQuery")
                        }
                    }
                });
            } else {
                res.send("You are not logged in!!");
            }
        });
    }
}
