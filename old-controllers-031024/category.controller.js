'use strict'
var config = require('../../tools/config');
var db = require('../../knex/knex');
var Utils = require('../utils/utils');


/**
 * @route GET /category
 * @group Category
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.getCategory = (req, res) => {
  var response = {}
  var userId = req.userId
  var storeId = req.storeId
  var companyId = req.companyId
  if(storeId == 0){
      response = { success: false, message: 'You Not Affiliate In Any Store' }
      Utils.sendStatus(res, 200, response);
  } else {
    var dataSelectStore = {
        store_id: storeId
    }
    db('m_category')
      .where(dataSelectStore)
      .then(async (rowCategory) => {
          response = { success: true, message: 'Success Get Category', data: rowCategory }
      })
      .catch(error => {
          response = { success: false, message: 'Cannot Getting Data Category', data: error }
      })
      .finally(() => {
          Utils.sendStatus(res, 200, response)
      });
  }
}

/**
 * @route POST /category
 * @group Category
 * @param {string} nama.query.required - Name
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.createCategory = (req, res) => {
  var response = {}
  var userId = req.userId
  var storeId = req.storeId
  var companyId = req.companyId
  if(storeId == 0){
      response = { success: false, message: 'You Not Affiliate In Any Store' }
      Utils.sendStatus(res, 200, response);
  } else {
    var dataInsert = {
        nama: req.query.nama,
        store_id: storeId
    }
    db('m_category')
      .insert(dataInsert)
      .returning('id')
      .then((rowCategory) => {
          response = { success: true, message: 'Success Create Category', data: rowCategory }
      })
      .catch(error => {
          response = { success: false, message: 'Cannot Create Category', data: error }
      })
      .finally(() => {
          Utils.sendStatus(res, 200, response)
      });
  }
}
