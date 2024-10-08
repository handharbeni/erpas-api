'use strict'
var jwt = require('jsonwebtoken');
var config = require('../../tools/config');
var db = require('../../knex/knex');
var Utils = require('../utils/utils');
var bcrypt = require('bcryptjs');



/**
 * @route GET /voucher
 * @group Voucher
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.getVoucher = (req, res) => {
  var response = {}
  var table = 'master_voucher';
  var userId = req.userId
  var storeId = req.storeId
  if (storeId != 0) {
    var dataSelect = {
      id_store: storeId
    }
    let getData = getFromTable(table, dataSelect)
    getData.then(
      (success) => {
        response = { success: true, message: 'Success Getting Data', data: success }
        Utils.sendStatus(res, 200, response)
      },
      (error) => {
        response = { success: false, message: 'Failed Getting Data', data: error }
        Utils.sendStatus(res, 200, response)
      }
    )
  }else{
    response = { success: false, message: 'Token Unauthorized' }
    Utils.sendStatus(res, 200, response)
  }
}


/**
 * @route POST /voucher
 * @group Voucher
 * @param {string} nama_voucher.query.required Nama voucher
 * @param {string} type_voucher.query.required Type Voucher (1: Transactional, 2: Item)
 * @param {string} value.query Value (Minimum QTY on type 2)
 * @param {string} percentage.query Percentage (Discount On type 1)
 * @param {string} item.query Item Free (On Type 2)
 * @param {string} list_item.query List Item Promo ex: 1, 2, 3 (separated by comma)
 * @param {string} date_expired.query Date Expired
 * @param {string} max_used.query Allowed Used Voucher
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */

exports.createVoucher = (req, res) => {
  var table = 'master_voucher';
  var response = {}
  var userId = req.userId
  var storeId = req.storeId
  if (storeId != 0) {
    var dataInsert = {
      nama_voucher: req.query.nama_voucher,
      type_voucher: req.query.type_voucher,
      id_store: storeId,
      value: req.query.value,
      percentage: req.query.percentage,
      item: req.query.item,
      list_item: req.query.list_item,
      date_expired: req.query.date_expired,
      max_used: req.query.max_used,
      used: 0,
      isActive: true
    }
    let createNew = insertToTable(table, dataInsert)
    createNew.then(
      (success) => {
        response = { success: true, message: 'Create Voucher Success', data: success }
        Utils.sendStatus(res, 200, response)
      },
      (error) => {
        response = { success: false, message: 'Create Failed', data: error }
        Utils.sendStatus(res, 200, response)
      }
    )
  }else{
    response = { success: false, message: 'Token Unauthorized' }
    Utils.sendStatus(res, 200, response)
  }
}

/**
 * @route DELETE /voucher
 * @group Voucher
 * @param {string} id_voucher.query.required Id Voucher
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.deleteVoucher = (req, res) => {
  var table = 'master_voucher';
  var response = {}
  var userId = req.userId
  var storeId = req.storeId
  if (storeId != 0) {
    var dataSelect = {
      id_store: storeId,
      id: req.query.id_voucher
    }
    var dataUpdate = {
      isActive: false
    }
    let deleteData = updateToTable(table, dataSelect, dataUpdate)
    deleteData.then(
      (success) => {
        response = { success: true, message: 'Delete Voucher Success', data: success }
        Utils.sendStatus(res, 200, response)
      },
      (error) => {
        response = { success: false, message: 'Delete Voucher Failed', data: error }
        Utils.sendStatus(res, 200, response)
      }
    )
  }else{
    response = { success: false, message: 'Token Unauthorized' }
    Utils.sendStatus(res, 200, response)
  }
}


/**
 * @route PUT /voucher
 * @group Voucher
 * @param {string} id_voucher.query.required Id Voucher
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.validateVoucher = (req, res) => {
  var table = 'master_voucher';
  var response = {}
  var userId = req.userId
  var storeId = req.storeId
  if (storeId != 0) {
    var dataSelect = {
      id_store: storeId,
      id: req.query.id_voucher
    }
    let checkVoucher = getFromTable(table, dataSelect)
    checkVoucher.then(
      (success) => {
        if(success.length > 0){
          response = { success: true, message: 'Voucher Valid!', data: success }
        }else{
          response = { success: false, message: 'Voucher Invalid!' }
        }
        Utils.sendStatus(res, 200, response)
      },
      (error) => {
        response = { success: false, message: 'Voucher Not Valid', data: error }
        Utils.sendStatus(res, 200, response)
      }
    )
  }else{
    response = { success: false, message: 'Token Unauthorized' }
    Utils.sendStatus(res, 200, response)
  }
}

exports.useVoucher = (req, res) => {
  var table = 'master_voucher';
  var response = {}
  var userId = req.userId
  var storeId = req.storeId
  if (storeId != 0) {

  }else{
    response = { success: false, message: 'Token Unauthorized' }
    Utils.sendStatus(res, 200, response)
  }
}

function insertToTable(table, data){
  return new Promise((resolve, reject) => {
    db(table)
      .insert(data)
      .then(resultInsert => {
        resolve(resultInsert)
      })
      .catch(error => {
        reject(error)
      })
  });
}

function updateToTable(table, dataSelect, dataUpdate){
  return new Promise((resolve, reject) => {
    db(table)
      .where(dataSelect)
      .update(dataUpdate)
      .then(resultUpdate => {
        resolve(resultUpdate)
      })
      .catch(error => {
        reject(error)
      })
  });
}

function getFromTable(table, data){
  return new Promise(function(resolve, reject) {
    db(table)
      .where(data)
      .then(resultSelect => {
        resolve(resultSelect)
      })
      .catch(error => {
        reject(error)
      })
  });
}

function rawQuery(query){
  return new Promise(function(resolve, reject) {
    db.raw(query)
      .then(resultQuery => {
        resolve(resultQuery[0])
      })
      .catch(error => {
        reject(error)
      })
  });
}
