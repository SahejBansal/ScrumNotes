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

async function checkClientAndSecret(cID, cSEC, cb) {
  const clientIdAndClientSecretQuery =
    "SELECT * FROM applications WHERE client_id=? AND client_secret=?";
  const clientIdAndClientSecretParams = [cID, cSEC];
  const clientIdAndClientSecretResult = await dbQuery(
    clientIdAndClientSecretQuery,
    clientIdAndClientSecretParams
  );
  if (Object.keys(clientIdAndClientSecretResult).length !== 0) {
    //   console.log(clientIdAndClientSecretResult[0].application_id)
    cb(true, clientIdAndClientSecretResult[0].application_id);
  } else {
    cb(false);
  }
}
async function tokenGen(userId, appId, cb) {
  const newToken = randomString(21);

  const tokenQuery =
    "INSERT INTO user_applications(user_id,application_id,token) VALUES(?,?,?)";
  const tokenQueryParams = [userId, appId, newToken];

  const tokenQueryResult = await dbQuery(tokenQuery, tokenQueryParams);
  if (tokenQueryResult !== null) {
    cb(newToken);
  }
}
async function getAppId(cID, cSEC) {
  var AppExistInDBsql =
    "SELECT * FROM applications WHERE client_id=? and client_secret=?";
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

async function 
userExists(name, email,appId,cb) {
  const userInUserSql = `SELECT userID FROM user WHERE email = "${email}"`;
  const userInUserResult = await dbQuery(userInUserSql);

  if(userInUserResult || userInUserResult !== null)
  {
    userInUserResult.map(async (userId,index)=>{
  
      const userInApplicationSql = `SELECT user_id FROM user_applications where application_id = "${appId}" AND user_id = "${userId.userID}"`
      const userInApplicationResult = await dbQuery(userInApplicationSql);
      if(userInApplicationResult === null || userInApplicationResult){
        console.log(userId.userID)

        return cb(true);
        
      }
      
    })
    
   
  }

  
  

}

var userAuthenticated = function (req, cb) {
  log("debug", "userAuthenticated");
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

async function existValueInDatabase(sql, params, cb) {
  const result = await dbQuery(sql, params);
  if (!result || result == null) {
    log("error", "existValueInDatabase error, sql: " + sql);
    cb(false);
  } else {
    cb(true);
  }
}

async function getOneValueSql(sql, params, cb) {
  log("debug", "getOneValueSql");
  const result = await dbQuery(sql, params);
  if (!result || result == null) {
    log("error", "getOneValueSql error, sql: " + sql);
    cb(false);
  } else {
    cb(true);
  }
}

async function getAppId(cID, cSEC) {
  const AppExistInDBsql =
    "SELECT * FROM applications WHERE client_id=? and client_secret=?";
  const params = [cID, cSEC];
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

async function getUserId(token) {
  const UserExistsql = "SELECT user_id FROM user_applications WHERE token = ?";
  const params = [token];
  const result = await dbQuery(UserExistsql, params);
  if (!result || result == null) {
    console.log("Error fetching App Id");
    return null;
  } else {
    response = JSON.parse(JSON.stringify(result));
    var UserId = response[0].user_id;
    return UserId;
  }
}

async function getEtherpadGroupFromNormalGroup(id, cb) {
  var getMapperSql = "Select * from store where store.key = ?";
  var result = await dbQuery(getMapperSql, ["mapper2group:" + id]);
  //var getMapperQuery = connection2.query(getMapperSql, ["mapper2group:" + id]);
  // getMapperQuery.on('error', mySqlErrorHandler);
  // getMapperQuery.on('result', function (mapper) {
  //     cb(mapper.value.replace(/"/g, ''));
  // });
  if (!result || result == null) {
    console.log("Error getEtherpadGroupFromNormalGroup");
    return null;
  } else {
    response = JSON.parse(JSON.stringify(result));
    cb(response[0].value.replace(/"/g, ""));
  }
}

function addUserToEtherpad(userName) {
  let author = etherpad.createAuthorIfNotExistsFor(userName, null);
  if (author === null) throw new Error("there was an error creating user");
  return author;
}

async function getPadsSettings(cb) {
  var getSettingsSql = "Select * from Settings";
  var result = await dbQuery(getSettingsSql);
  var settings = {};
  settings[result.key] = result.value;
  cb(settings);
}

function getGroup(groupId, cb) {
  log("debug", "getGroup");
  var sql = "Select * from etherpad.groups where groupID = ?";
  getOneValueSql(sql, [groupId], cb);
}

function getUser(userId, cb) {
  log("debug", "getUser");
  var sql = "Select * from etherpad.user where userID = ?";
  getOneValueSql(sql, [userId], cb);
}

module.exports = {
  async saveInDB(req, res) {
    args = {
      name: req.body.appName,
      url: req.body.appUrl,
    };
    var cID = randomString(21);
    var cSEC = randomString(21);
    var saveInDBsql =
      "INSERT INTO applications (name, url, client_id, client_secret) VALUES (?,?,?,?)";
    var params = [args.name, args.url, cID, cSEC];
    const result = await dbQuery(saveInDBsql, params);
    // var getSavedsql = `SELECT * FROM applications WHERE name=?`;
    // const result2 = await dbQuery(getSavedsql, [args.name]);
    // response = JSON.parse(JSON.stringify(result2))
    // vals = response[0];
    if (!result || result == null) {
      console.log(err);
    } else {
      console.log("success");
      res.send({
        code: 201,
        message: "success",
        data: {
          cID: cID,
          cSEC: cSEC,
          id: result.insertId,
        },
      });
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
      client_id: req.body.client_id,
      client_secret: req.body.client_secret,
    };
    const emailRegex = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

    checkClientAndSecret(
      args.client_id,
      args.client_secret,
      async function (exists, appId) {
        if (exists) {
          if (emailRegex.test(args.email)) {
            registerUserSql = "INSERT INTO user(name,email,confirmed) VALUES(?,?,1)";
            var params = [args.name, args.email];

            userExists(args.name,args.email,appId, function(exists){
              if(!exists)
              {
                console.log(false)
                res.send(false)
              }else{
                console.log(true)
                res.send(true)
              }
            })

            // const verifyUserExists = await userExists(args.name, args.email,appId);
            // console.log("verifyUserExists = " +verifyUserExists)
            // if (!verifyUserExists) {
            //   var registerUserQuery = await dbQuery(registerUserSql, params);
            //   tokenGen(
            //     registerUserQuery.insertId,
            //     appId,
            //     async function (token) {
            //       // console.log(token)

            //       res.status(201).send({
            //         code: 201,
            //         message: "Registration Successful",
            //         data: { token: token },
            //       });
            //     }
            //   );
            // } else {
            //   res
            //     .status(409)
            //     .send({ code: 409, message: "User already exists", data: {} });
            // }
          } else {
            res
              .status(400)
              .send({ code: 400, message: "Invalid Email", data: {} });
          }
        } else {
          res.status(404).send({
            code: 400,
            message: "Application ID does not exist.",
            data: {},
          });
        }
      }
    );

    // if (emailRegex.test(args.email)) {
    //     registerUserSql = 'INSERT INTO user(name,email) VALUES(?,?)'
    //     var params = [args.name, args.email]
    //     const verifyUserExists = await userExists(args.name, args.email)

    //     if (!verifyUserExists) {
    //         var registerUserQuery = await dbQuery(registerUserSql, params)
    //         res.send(registerUserQuery)
    //     } else {
    //         // console.log("User already exists")
    //         res.send("User already exists")
    //     }

    // } else {
    //     res.send("Invalid Email")
    // }
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
        args = {
          groupName: req.body.name,
          token: req.body.token,
        };
        if (!fields.groupName) {
          sendError("Group Name not defined", res);
          return;
        }
        userId = getUserId(args.token);
        if (userId != null || userId != "") {
          var existGroupSql = "SELECT * from etherpad.groups WHERE name = ?";
          getOneValueSql(
            existGroupSql,
            [args.groupName],
            async function (found) {
              if (found) {
                sendError("Group already exists", res);
                return;
              } else {
                var addGroupSql = "INSERT INTO etherpad.groups VALUES(null, ?)";
                var group = await dbQuery(addGroupSql, [args.groupName]);
                data.groupid = group.insertId;
                var addUserGroupSql =
                  "INSERT INTO etherpad.usergroup Values(?,?,1)";
                var addUserGroupQuery = await dbQuery(addUserGroupSql, [
                  userId,
                  group.insertId,
                ]);
                if (addUserGroupQuery) {
                  etherpad.createGroupIfNotExistsFor(
                    group.insertId.toString(),
                    function (err, val) {
                      if (err) {
                        log("error", "failed to createGroupIfNotExistsFor");
                      } else {
                        data.success = true;
                        data.error = null;
                        data.groupId = val.groupID;
                        res.send({
                          code: 201,
                          message: "Created",
                          data: { data },
                        });
                      }
                    }
                  );
                } else {
                  res.send({
                    code: "404",
                    message: "error addusergroupQuery",
                    data: {},
                  });
                }
              }
            }
          );
        } else {
          res.send({
            code: "404",
            message: "User does not exist for provided token",
            data: {},
          });
        }
      } else {
        res.send({ code: "401", message: "You are not logged in!!", data: {} });
      }
    });
  },

  async createPad(req, res) {
    userAuthenticated(req, function (authenticated) {
      if (authenticated) {
        if (!req.body.groupId) {
          sendError("Group-Id not defined", res);
          return;
        } else if (!req.body.padName) {
          sendError("Pad Name not defined", res);
          return;
        }
        args = {
          groupId: req.body.groupId,
          padName: req.body.padName,
        };
        var existPadInGroupSql =
          "SELECT * from grouppads where grouppads.GroupID = ? and grouppads.PadName = ?";
        getOneValueSql(
          existPadInGroupSql,
          [args.groupId, args.padName],
          async function (found) {
            if (found || args.padName.length == 0) {
              sendError("Pad already Exists", res);
            } else {
              var addPadToGroupSql = "INSERT INTO GroupPads VALUES(?, ?)";
              var addPadToGroupQuery = await dbQuery(addPadToGroupSql, [
                fields.groupId,
                fields.padName,
              ]);
              if (addPadToGroupQuery) {
                var data = {};
                data.success = true;
                data.error = null;
                res.send({
                  code: "201",
                  message: "addPadToGroups success",
                  data: { data },
                });
              } else {
                res.send({
                  code: "400",
                  message: "error addPadToGroupQuery",
                  data: {},
                });
              }
            }
          }
        );
      } else {
        res.send({ code: "401", message: "You are not logged in", data: {} });
      }
    });
  },

  async directToPad(req, res) {
    userAuthenticated(req, function (authenticated) {
      if (authenticated) {
        if (!req.body.groupId) {
          sendError("Group-Id not defined", res);
          return;
        }
        args = {
          groupId: req.body.groupId,
          token: req.body.token,
          padname: req.body.padName,
        };
        userId = getUserId(args.token);
        if (userId) {
          var userInGroupSql =
            "SELECT * from UserGroup where UserGroup.userId = ? and UserGroup.groupID= ?";
          getOneValueSql(
            userInGroupSql,
            [userId, args.groupId],
            function (found) {
              if (found) {
                getEtherpadGroupFromNormalGroup(args.groupId, function (group) {
                  (async () => {
                    let etherpad_author = await addUserToEtherpad(userId);
                    console.log(etherpad_author); // {"metadata": "for: test.png"}
                    //console.log("ETHERPAD AUTHOR " + etherpad_author);
                    // addUserToEtherpad(req.session.userId, function (etherpad_author) {
                    if (etherpad_author) {
                      //console.log("etherpad autoh is : " + etherpad_author.authorID);
                      (async () => {
                        let session = await etherpad.createSession(
                          group,
                          etherpad_author.authorID,
                          Date.now() + 7200000
                        );
                        //sessionManager.createSession(group, etherpad_author.authorID, Date.now() +
                        var data = {};
                        data.success = true;
                        data.session = session.sessionID;
                        data.group = group;
                        // data.username = req.session.username,
                        data.pad_name = args.padname;
                        data.padID = group + "$" + args.padname;
                        // data.location = fields.location;
                        res.send({
                          code: 201,
                          message: "Session created",
                          data: { data },
                        });
                        console.log(data);
                      })();
                    }
                  })();
                });
              } else {
                res.send({ code: 404, message: "User not in Group", data: {} });
              }
            }
          );
        } else {
          res.send({
            code: 404,
            message: "User doesnt exist for given token",
            data: {},
          });
        }
      } else {
        res.send({ code: 401, message: "You are not logged in", data: {} });
      }
    });
  },

  //working on this endpoint
  async getPadUrl(req, res) {
    getPadsSettings(function (settings) {
      userAuthenticated(req, function (authenticated) {
        if (authenticated) {
          args = {
            token: req.body.token,
            groupID: req.body.groupID,
            padID: req.body.padID,
          };
          userId = getUserId(args.token);
          getGroup(args.groupID, function (found, currGroup) {
            getUser(userId, function (found, currUser) {
              var padID = args.padID;
              var slice = padID.indexOf("$");
              padID = padID.slice(slice + 1, padID.length);
              var padsql = "select * from GroupPads where PadName = ?";
              existValueInDatabase(padsql, [padID], function (found) {
                var render_args;
                if (found && currUser && currGroup && currGroup.length > 0) {
                  render_args = {
                    errors: [],
                    padname: padID,
                    userid: req.session.userId,
                    username: req.session.username,
                    baseurl: req.session.baseurl,
                    groupID: req.params.groupID,
                    groupName: currGroup[0].name,
                    settings: settings,
                    padurl: req.session.baseurl + "/p/" + req.params.padID,
                  };
                  // res.send(eejs
                  //     .require("ep_maadix/templates/pad.ejs",
                  //         render_args));
                } else if (
                  !found &&
                  currUser &&
                  currGroup &&
                  currGroup.length > 0
                ) {
                  //group is ok but pad does not exist
                  render_args = {
                    errors: [],
                    padname: false,
                    userid: req.session.userId,
                    username: req.session.username,
                    baseurl: req.session.baseurl,
                    groupID: req.params.groupID,
                    groupName: currGroup[0].name,
                    settings: settings,
                    padurl: false,
                  };
                  // res.send(eejs
                  //     .require("ep_maadix/templates/pad.ejs",
                  //         render_args));
                } else {
                  //Evrithing is bad
                  render_args = {
                    errors: [],
                    padname: false,
                    userid: req.session.userId,
                    username: req.session.username,
                    baseurl: req.session.baseurl,
                    groupID: false,
                    groupName: false,
                    settings: settings,
                    padurl: false,
                  };
                  // res.send(eejs
                  //     .require("ep_maadix/templates/pad.ejs",
                  //         render_args));
                }
              });
            });
          });
        } else {
          // res.redirect("/login")
          res.send({ code: 401, message: "You are not logged in", data: {} });
        }
      });
    });
  },
};