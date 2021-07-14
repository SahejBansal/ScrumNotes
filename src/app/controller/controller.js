const Crypto = require("crypto");
const { exists } = require("fs");

api = require("etherpad-lite-client");
const etherpad = api.connect({
  apikey: "308c704c36b41c846ba1713a59f92c6a9707ced910894de32070287a03bfcb68",
  host: "localhost",
  port: 9001,
});

setInterval(function () {
  await dbQuery(`SELECT 1`, []);
  await dbQuery2(`SELECT 1`, []);
})

function randomString(size) {
  return Crypto.randomBytes(size).toString("base64").slice(0, size);
}

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

async function getAppId(token, cb) {
  console.log("DEBUG", "getting AppID");
  var AppExistInDBsql = "SELECT * FROM user_applications WHERE token=?";
  var params = [token];
  const result = await dbQuery(AppExistInDBsql, params);
  if (!result || result == null) {
    console.log("Error fetching App Id");
    cb(0);
  } else {
    response = JSON.parse(JSON.stringify(result));
    var appId = response[0].application_id;
    console.log("log", "fetched appId from token:" + appId);
    cb(appId);
  }
}

async function userExists(email, appId, cb) {
  const userInUserSql = `SELECT userID FROM user WHERE email = "${email}"`;
  const params = [];
  const userInUserResult = await dbQuery(userInUserSql, params);
  // console.log(userInUserResult);

  if (Object.keys(userInUserResult).length === 0) {
    return cb(false);
  } else if (Object.keys(userInUserResult).length !== 0) {
    // var flag = true
    userInUserResult.map(async (userId, index) => {
      // console.log(index,userId)
      const userInApplicationSql = `SELECT user_id FROM user_applications where application_id = "${appId}" AND user_id = "${userId.userID}"`;
      const userInApplicationResult = await dbQuery(
        userInApplicationSql,
        params
      );
      console.log(userInApplicationResult);

      if (Object.keys(userInApplicationResult).length !== 0) {
        // console.log(flag+"one")
        // flag = true;
        return cb(true);
      } else if (Object.keys(userInApplicationResult).length === 0) {
        // flag = false
        return cb(false);
      }
    });
  }
}

var userAuthenticated = function (req, cb) {
  console.log("debug", "userAuthenticated");
  if (req.body.token) {
    cb(true);
  } else {
    cb(false);
  }
};

async function existValueInDatabase(sql, params, cb) {
  const result = await dbQuery(sql, params);
  if (!result || result == null) {
    console.log("error", "existValueInDatabase error, sql: " + sql);
    cb(false);
  } else {
    cb(true);
  }
}

async function getOneValueSql(sql, params, cb) {
  console.log("debug", "getOneValueSql:" + sql);
  const result = await dbQuery(sql, params);
  if (!result || result == null || result == "") {
    console.log("error", "getOneValueSql error");
    cb(false, result);
  } else {
    console.log("log", "getoneValueSql Result:" + result);
    cb(true, result);
  }
}

async function getUserId(token, cb) {
  const UserExistsql = "SELECT user_id FROM user_applications WHERE token = ?";
  const params = [token];
  const result = await dbQuery(UserExistsql, params);
  if (!result || result == null || result == "") {
    console.log("Error fetching App Id");
    cb(false);
  } else {
    response = JSON.parse(JSON.stringify(result));
    var UserId = response[0].user_id;
    console.log("log", "fetched userId from token:" + UserId);
    cb(UserId);
  }
}

async function getUserObj(userId, cb) {
  const UserNameSql = "SELECT * FROM etherpad.user WHERE userID = ?";
  const params = [userId];
  const result = await dbQuery(UserNameSql, params);
  if (!result || result == null || result == "") {
    console.log("Error fetching App Id");
    cb(false);
  } else {
    response = JSON.parse(JSON.stringify(result));
    // var UserId = response[0].name;
    // console.log("log", "fetched userId from token:" + UserId);
    cb(response)
  }
}

async function getEtherpadGroupFromNormalGroup(id, cb) {
  var getMapperSql = "Select * from store where store.key = ?";
  var result = await dbQuery2(getMapperSql, ["mapper2group:" + id]);
  //var getMapperQuery = connection2.query(getMapperSql, ["mapper2group:" + id]);
  // getMapperQuery.on('error', mySqlErrorHandler);
  // getMapperQuery.on('result', function (mapper) {
  //     cb(mapper.value.replace(/"/g, ''));
  // });
  if (!result || result == null || result == "") {
    console.log("Error getEtherpadGroupFromNormalGroup");
    return null;
  } else {
    stringr = JSON.parse(JSON.stringify(result));
    console.log(stringr);
    cb(stringr[0].value.replace(/"/g, ""));
  }
}

function addUserToEtherpad(userId, userName, cb) {
  var params = {
    authorMapper: userId,
    name: userName
  }
  var createdAuthor;
  etherpad.createAuthorIfNotExistsFor(params, function (err, data) {
    if (err) {
      console.error('Error: ' + err.message);
      throw new Error("there was an error creating user");
    } else {
      console.log('Author created: ' + data.authorID);
      createdAuthor = data;
      cb(createdAuthor)
    }
  });
}

async function getPadsSettings(cb) {
  var getSettingsSql = "Select * from Settings";
  var result = await dbQuery(getSettingsSql);
  var settings = {};
  settings[result.key] = result.value;
  cb(settings);
}

function getGroup(groupId, cb) {
  console.log("debug", "getGroup");
  var sql = "Select * from etherpad.groups where groupID = ?";
  getOneValueSql(sql, [groupId], cb);
}

function getUser(userId, cb) {
  console.log("debug", "getUser");
  var sql = "Select * from etherpad.user where userID = ?";
  getOneValueSql(sql, [userId], cb);
}

function sendError(error, code, res) {
  var data = {};
  data.success = false;
  data.error = error;
  console.log("error", error);
  res.send({
    code: code,
    message: error,
    data: {},
  });
}

function addPadToEtherpad(padName, groupId, cb) {
  getEtherpadGroupFromNormalGroup(groupId, function (group) {
    params = {
      groupID: group,
      padName: padName,
      text: "Insert default text here",
    };
    etherpad.createGroupPad(params, function (err) {
      if (err) {
        console.log("error", "something went wrong while adding a group pad");
        console.log("error", err);
      } else {
        var padID = params.groupID + "$" + params.padName;
        args = {
          padID: padID,
        };
        etherpad.setPublicStatus(args, function (err, data) {
          if (err) {
            console.error("Error: " + err.message);
          } else {
            console.log("set public: " + data.message);
            console.log("debug", "Pad added");
            cb(true);
          }
        });
      }
    });
  });
}

module.exports = {
  /*
  Saves given name and url into application table. Checks if given name and url combination exists in table. If not then simply creates a new entry.

  @params
  req: browser request
  res: browser response
  */
  async saveInDB(req, res) {
    args = {
      name: req.body.appName,
      url: req.body.appUrl,
    };
    getOneValueSql("SELECT * FROM applications where name = ? and url = ?", [args.name, args.url], async function (found) {
      if (found) {
        sendError("Application already exists for name and url", 401, res);
        return;
      } else {
        var cID = randomString(21);
        var cSEC = randomString(21);
        var saveInDBsql =
          "INSERT INTO applications (name, url, client_id, client_secret) VALUES (?,?,?,?)";
        var params = [args.name, args.url, cID, cSEC];
        const result = await dbQuery(saveInDBsql, params);
        if (!result || result == null) {
          console.log(err);
          sendError("Eror occurred while registering application: " + err, 400, res);
          return;
        } else {
          console.log("success");
          res.send({
            code: 201,
            message: "success",
            data: {
              client_id: cID,
              client_secret: cSEC,
              id: result.insertId,
            },
          });
        }
      }
    })
  },

  /*
  Registers new user into user table. Checks for validity of email. Then checks if user email exists for the specific application the user is coming from (test/dev/live).
  If not exists for specific application id (based on client ID and secret), then creates new entry in user table -> generates token -> creates entry in user applications table
  with generated token.
  @params
  req: browser request
  res: browser response
  */
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
            registerUserSql =
              "INSERT INTO user(name,email,confirmed) VALUES(?,?,1)";
            var params = [args.name, args.email];

            userExists(args.email, appId, async function (exists) {
              if (!exists) {
                const newUserResult = await dbQuery(registerUserSql, params);
                // console.log(newUserResult);
                tokenGen(newUserResult.insertId, appId, function (token) {
                  res.status(201).send({
                    code: 201,
                    message: "Registration Successful",
                    data: { token: token, userID: newUserResult.insertId },
                  });
                });
              } else {
                // console.log(true)
                res.status(409).send({
                  code: 409,
                  message: `user already exists for app id = ${appId}`,
                  data: {},
                });
              }
            });
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
  },

  /*
  Checks if group names exists, if not then creates a group entry in group table. Then creates an etherpad group for the generated groupID
  @params
  req: browser request
  res: browser response
  */
  async createGroup(req, res) {
    userAuthenticated(req, function (authenticated) {
      var data = {};
      if (authenticated) {
        args = {
          groupName: req.body.name,
          token: req.body.token,
        };
        if (!args.groupName || args.groupName == "") {
          sendError("Group Name not defined", 400, res);
          return;
        }
        getUserId(args.token, async function (userId) {
          if (userId != null && userId != "" && userId != false) {
            getAppId(args.token, async function (appId) {
              if (appId == 0) {
                sendError("Application not found", 400, res);
                return;
              } else {
                var existGroupSql =
                  "SELECT * from etherpad.groups WHERE name = ? AND application_id = ?";
                getOneValueSql(
                  existGroupSql,
                  [args.groupName, appId],
                  async function (found) {
                    if (found) {
                      sendError("Group already exists", 400, res);
                      return;
                    } else {
                      var addGroupSql =
                        "INSERT INTO etherpad.groups (name, application_id) VALUES(?, ?);";
                      var group = await dbQuery(addGroupSql, [args.groupName, appId]);
                      data.groupid = group.insertId;
                      console.log(
                        "log",
                        "Inserted group Id: " + group.insertId
                      );
                      var addUserGroupSql =
                        "INSERT INTO usergroup VALUES(?, ?, 1)";
                      console.log("log", "using userId:" + userId);
                      var addUserGroupQuery = await dbQuery(addUserGroupSql, [
                        userId,
                        group.insertId,
                      ]);
                      if (addUserGroupQuery) {
                        params = {
                          groupMapper: group.insertId.toString(),
                        };
                        etherpad.createGroupIfNotExistsFor(
                          params,
                          function (err, val) {
                            if (err) {
                              console.log(
                                "error",
                                "failed to createGroupIfNotExistsFor: " +
                                err.message
                              );
                              res.send({
                                code: 400,
                                message: "Failed: Etherpad Error",
                                data: {},
                              });
                            } else {
                              data.success = true;
                              data.error = null;
                              data.EtherpadGroupId = val.groupID;
                              res.send({
                                code: 201,
                                message: "Created",
                                data: data,
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
              }
            });
          } else {
            res.send({
              code: "404",
              message: "User does not exist for provided token",
              data: {},
            });
          }
        });
      } else {
        res.send({ code: "401", message: "You are not logged in!!", data: {} });
      }
    });
  },

  /*
  Checks if pad name exists, if not then creates a pad entry in grouppads table. Then creates an etherpad group pad for the generated padID
  @params
  req: browser request
  res: browser response
  */
  async createPad(req, res) {
    userAuthenticated(req, function (authenticated) {
      if (authenticated) {
        if (!req.body.groupId) {
          sendError("Group-Id not defined", 400, res);
          return;
        } else if (!req.body.padName) {
          sendError("Pad Name not defined", 400, res);
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
              sendError("Pad already Exists", 400, res);
            } else {
              var addPadToGroupSql = "INSERT INTO GroupPads VALUES(?, ?)";
              var addPadToGroupQuery = await dbQuery(addPadToGroupSql, [args.groupId, args.padName]);
              if (addPadToGroupQuery) {
                addPadToEtherpad(args.padName, args.groupId, function (added) {
                  if (added) {
                    var data = {};
                    data.success = true;
                    data.error = null;
                    res.send({
                      code: "201",
                      message: "addPadToGroups success",
                      data: data
                    });
                  } else {
                    sendError("Etherpad add GroupPad error", 400, res);
                    return;
                  }
                })
              } else {
                res.send({
                  code: "400",
                  message: "error addPadToGroupQuery",
                  data: {}
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
          sendError("Group-Id not defined", 400, res);
          return;
        }
        args = {
          groupId: req.body.groupId,
          token: req.body.token,
          padname: req.body.padName,
        };
        getUserId(args.token, async function (userId) {
          if (userId) {
            getUserObj(userId, async function (userObj) {
              var userName = userObj[0].name;
              var userInGroupSql =
                "SELECT * from UserGroup where UserGroup.userId = ? and UserGroup.groupID= ?";
              getOneValueSql(userInGroupSql, [userId, args.groupId], function (found) {
                if (found) {
                  getEtherpadGroupFromNormalGroup(args.groupId, function (group) {
                    addUserToEtherpad(userId, userName, function (etherpad_author) {
                      console.log(etherpad_author); // {"metadata": "for: test.png"}
                      //console.log("ETHERPAD AUTHOR " + etherpad_author);
                      // addUserToEtherpad(req.session.userId, function (etherpad_author) {
                      if (etherpad_author) {
                        //console.log("etherpad autoh is : " + etherpad_author.authorID);
                        sessionParams = {
                          groupID: group,
                          authorID: etherpad_author.authorID,
                          validUntil: Date.now() + 86400
                        }
                        etherpad.createSession(sessionParams, function (err, session) {
                          if (err) {
                            console.error('Error: ' + err.message);
                          }
                          else {
                            console.log('Session created: ' + session.sessionID);
                            var data = {};
                            data.success = true;
                            data.session = session.sessionID;
                            data.group = group;
                            data.author = etherpad_author.authorID;
                            // data.username = req.session.username,
                            data.pad_name = args.padname;
                            data.padID = group + "$" + args.padname;
                            // data.location = fields.location;
                            res.send({
                              code: 201,
                              message: "Session created",
                              data: data,
                            });
                            console.log(data);
                          }
                        });
                      }
                    })
                  });
                } else {
                  res.send({ code: 404, message: "User not in Group", data: {} });
                }
              }
              );
            })
          } else {
            res.send({
              code: 404,
              message: "User doesnt exist for given token",
              data: {},
            });
          }
        });
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
          getUserId(args.token, async function (userId) {
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
                      userid: userId,
                      // username: req.session.username,
                      // baseurl: req.session.baseurl,
                      groupID: req.body.groupID,
                      groupName: currGroup[0].name,
                      settings: settings,
                      padurl: "localhost:9001" + "/p/" + req.body.padID,
                    };
                    res.send({
                      code: 201,
                      message: "success",
                      data: render_args
                    });
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
                      userid: userId,
                      // username: req.session.username,
                      // baseurl: req.session.baseurl,
                      groupID: req.body.groupID,
                      groupName: currGroup[0].name,
                      settings: settings,
                      padurl: false,
                    };
                    res.send({
                      code: 402,
                      message: "error: pad does not exist",
                      data: render_args
                    });
                  } else {
                    //Evrithing is bad
                    render_args = {
                      errors: [],
                      padname: false,
                      userid: userId,
                      // username: req.session.username,
                      // baseurl: req.session.baseurl,
                      groupID: false,
                      groupName: false,
                      settings: settings,
                      padurl: false,
                    };
                    res.send({
                      code: 400,
                      message: "error",
                      data: render_args
                    });
                  }
                });
              });
            });
          });

        } else {
          res.send({ code: 401, message: "You are not logged in", data: {} });
        }
      });
    });
  }
};
