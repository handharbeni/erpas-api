'use strict'
var Utils = require('../utils/utils');

exports.index = (req, res) => {
    var response = 'Welcome To ERpas API'
    Utils.sendStatus(res, 200, response);
}