'use strict'
var jwt = require('jsonwebtoken');
var config = require('../../tools/config');
var db = require('../../knex/knex');
var Utils = require('../utils/utils');
var bcrypt = require('bcryptjs');

/**
 * @route GET /withdraw
 * @group Withdraw
 * @param {string} is_kloter.query.required Result From Kloter (true / false)
 * @param {integer} kloter_id.query Kloter Id (Mandatory if Is Kloter true)
 * @param {integer} store_id.query Kloter Id (Mandatory if Is Kloter false)
 * @param {string} start_date.query.required Start Date (yyyy-m-d hh:mm:ss ex 2019-12-21 00:00:00)
 * @param {string} end_date.query.required End Date (yyyy-m-d hh:mm:ss ex 2019-12-21 23:59:59)
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.getListTransaction = (req, res) => {
  var response = { success: false, message: 'Insufficient Privileges' }
  var isKloter = req.query.is_kloter
  var id = isKloter==='true'?req.query.kloter_id:req.query.store_id
  var companyId = req.companyId

  var start_date = req.query.start_date
  var end_date = req.query.end_date
  var queryList = ""
  var queryCount = ""
  if (companyId != 0) {
    if (isKloter === 'true') {
      if (companyId != 0) {
        queryList = `SELECT * FROM transaction
                  INNER JOIN kloter_store ON kloter_store.id_store = transaction.store_id
                  INNER JOIN master_kloter ON master_kloter.id = kloter_store.id_kloter
                  INNER JOIN trxproducts ON trxproducts.transaction_id = transaction.id
                  WHERE
                  master_kloter.id =  ${id}
                  AND master_kloter.id_company = ${companyId}
                  AND transaction.is_withdraw = false
                  AND transaction.date_created between '${start_date}' and '${end_date}'`

        queryCount = `SELECT count(*) as total_transaksi, sum(trxproducts.hpp * trxproducts.qty) as total_revenue FROM transaction
                  INNER JOIN kloter_store ON kloter_store.id_store = transaction.store_id
                  INNER JOIN master_kloter ON master_kloter.id = kloter_store.id_kloter
                  INNER JOIN trxproducts ON trxproducts.transaction_id = transaction.id
                  WHERE
                  master_kloter.id =  ${id}
                  AND master_kloter.id_company = ${companyId}
                  AND transaction.is_withdraw = false
                  AND transaction.date_created between '${start_date}' and '${end_date}'`
      }
    }else{
      queryList = `SELECT * FROM transaction
                INNER JOIN trxproducts on trxproducts.transaction_id = transaction.id
                INNER JOIN stores on stores.id = transaction.store_id
                WHERE
                stores.id = ${id}
                AND transaction.is_withdraw = false
                AND transaction.date_created between '${start_date}' and '${end_date}'`
      queryCount = `SELECT count(*) as total_transaksi, sum(trxproducts.hpp * trxproducts.qty) as total_revenue FROM transaction
                INNER JOIN trxproducts on trxproducts.transaction_id = transaction.id
                INNER JOIN stores on stores.id = transaction.store_id
                WHERE
                stores.id = ${id}
                AND transaction.is_withdraw = false
                AND transaction.date_created between '${start_date}' and '${end_date}'`
    }
    response.success = true
    response.message = 'Success Get List Transaction'
    response.data = {}

    let getCount = rawQuery(queryCount)
    getCount.then(
      (success) => {
        response.data.count = success.length > 0 ? success[0] : {}
      },
      (error) => {
        response.success = false
        response.message = 'Failed Get Count'
        Utils.sendStatus(res, 200, response)
      }
    )
    let getList = rawQuery(queryList)
    getList.then(
      (success) => {
        response.data.list = success
        Utils.sendStatus(res, 200, response)
      },
      (error) => {
        response.success = false
        response.message = 'Failed Get List Transaction'
        Utils.sendStatus(res, 200, response)
      }
    )
  }else{
    response.success = false
    response.message = 'Insufficient Privileges'
    Utils.sendStatus(res, 200, response)
  }
}

/**
 * @route POST /withdraw
 * @group Withdraw
 * @param {string} is_kloter.query.required Result From Kloter (true / false)
 * @param {integer} kloter_id.query Kloter Id (Mandatory if Is Kloter true)
 * @param {integer} store_id.query Kloter Id (Mandatory if Is Kloter false)
 * @param {string} start_date.query.required Start Date (yyyy-m-d hh:mm:ss ex 2019-12-21 00:00:00)
 * @param {string} end_date.query.required End Date (yyyy-m-d hh:mm:ss ex 2019-12-21 23:59:59)
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.withdraw = (req, res) => {
  var response = { success: false, message: 'Insufficient Privileges' }
  var isKloter = req.query.is_kloter
  var id = isKloter==='true'?req.query.kloter_id:req.query.store_id
  var companyId = req.companyId

  var start_date = req.query.start_date
  var end_date = req.query.end_date
  var queryCount = ""

  var dataInsert = {}
  dataInsert.start_periode = start_date
  dataInsert.end_periode = end_date
  dataInsert.withdraw_by = req.userId

  var queryUpdate = ""

  if (companyId != 0) {
    if (isKloter === 'true') {
      dataInsert.kloter_id = id
      queryCount = `SELECT count(*) as total_transaksi, sum(trxproducts.hpp * trxproducts.qty) as total_revenue FROM transaction
                INNER JOIN kloter_store ON kloter_store.id_store = transaction.store_id
                INNER JOIN master_kloter ON master_kloter.id = kloter_store.id_kloter
                INNER JOIN trxproducts ON trxproducts.transaction_id = transaction.id
                WHERE
                master_kloter.id =  ${id}
                AND master_kloter.id_company = ${companyId}
                AND transaction.is_withdraw = false
                AND transaction.date_created between '${start_date}' and '${end_date}'`
      queryUpdate = `UPDATE transaction
                INNER JOIN kloter_store on kloter_store.id_store = transaction.store_id
                INNER JOIN master_kloter on master_kloter.id = kloter_store.id_kloter
                INNER JOIN trxproducts on trxproducts.transaction_id = transaction.id
                SET transaction.is_withdraw = true
                WHERE
                master_kloter.id =  ${id}
                AND master_kloter.id_company = ${companyId}
                AND transaction.is_withdraw = false
                AND transaction.date_created between '${start_date}' and '${end_date}'`
    }else{
      dataInsert.store_id = id
      queryCount = `SELECT count(*) as total_transaksi, sum(trxproducts.hpp * trxproducts.qty) as total_revenue FROM transaction
                INNER JOIN trxproducts on trxproducts.transaction_id = transaction.id
                INNER JOIN stores on stores.id = transaction.store_id
                WHERE
                stores.id = ${id}
                AND stores.company_id = ${companyId}
                AND transaction.is_withdraw = false
                AND transaction.date_created between '${start_date}' and '${end_date}'`
      queryUpdate = `UPDATE transaction
                INNER JOIN trxproducts on trxproducts.transaction_id = transaction.id
                INNER JOIN stores on stores.id = transaction.store_id
                SET transaction.is_withdraw = true
                WHERE
                stores.id = ${id}
                AND stores.company_id = ${companyId}
                AND transaction.is_withdraw = true
                AND transaction.date_created between '${start_date}' and '${end_date}'`
    }
    response.success = true
    response.message = 'Success Get List Transaction'
    response.data = {}

    let getCount = rawQuery(queryCount)
    getCount.then(
      (success) => {
        dataInsert.value = success.length > 0 ? success[0].total_revenue : 0

        let updateTransaction = rawQuery(queryUpdate)
        updateTransaction.then(
          (success) => {
            let insertWithdraw = insertToTable('withdrawal', dataInsert)
            insertWithdraw.then(
              (success) => {
                response.success = true
                response.message = 'Withdraw Success'
                Utils.sendStatus(res, 200, response)
              },
              (error) => {
                response.success = false
                response.message = 'Failed To Withdraw'
                Utils.sendStatus(res, 200, response)
              }
            )
          },
          (error) => {
            response.success = false
            response.message = 'Failed Update Transaction'
            Utils.sendStatus(res, 200, response)
          }
        )
      },
      (error) => {
        response.success = false
        response.message = 'Failed Get Count'
        Utils.sendStatus(res, 200, response)
      }
    )
  }else{
    response.success = false
    response.message = 'Insufficient Privileges'
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
