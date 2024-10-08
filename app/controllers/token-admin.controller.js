'use strict';
var jwt = require('jsonwebtoken');
var config = require('../../tools/config');
var db = require('../../knex/knex');
var Utils = require('../utils/utils');
var sqlite = require('../../tools/sqlite');

function verifyTokenAdmin(req, res, next) {
  var token = req.headers['access-token'];
  if (!token) return Utils.sendStatus(res, 200, { success: false, message: 'No token provided.' });
  jwt.verify(token, config.secretAdmin, (err, decoded) => {
    if (err) return Utils.sendStatus(res, 200, { success: false, message: 'Failed to authenticate token.' });
    req.userId = decoded.id;
    next();
  });
}
module.exports = verifyTokenAdmin;
