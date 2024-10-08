'use strict'
var jwt = require('jsonwebtoken');
var config = require('../../tools/config');
var db = require('../../knex/knex');
var Utils = require('../utils/utils');
var bcrypt = require('bcryptjs');


/**
 * @route GET /withdraw_operasional
 * @group Operasional
 * @param {string} store_id.query.required Store Id
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */

 exports.getTransactionOperasional = (req, res) => {
   var response = { success: false, message: 'Insufficient Privileges' }
   var userId = req.userId
   var storeId = req.query.store_id

   var dataOperasional = []

   var queryGroup = `SELECT date_format(start_periode, '%Y-%m-%d %H:%i:%s') as periode, sum(value_operasional) as value FROM t_operasional GROUP BY start_periode`;
   rawQuery(queryGroup).then(
     async (success) => {
       if(success.length > 0){
         response.success = true
         response.message = 'List of Operasional Transaction'
         await Promise.all(
           success.map(async rows => {
             var queryDetail = `select * from t_operasional where start_periode = '${rows.periode}'`;
             await rawQuery(queryDetail).then(
               (success) => {
                 rows.data = success
               },
               (error) => {}
             )
           })
         )
       }
       response.data = success
       Utils.sendStatus(res, 200, response)
     },
     (error) => {
       response.success = false
       response.message = 'Insufficient Privilegess'
       response.error = error
       Utils.sendStatus(res, 200, response)
     }
   )
 }
 /**
  * @route POST /withdraw_operasional
  * @group Operasional
  * @param {string} store_id.query.required Store Id
  * @param {string} start_date.query.required Start Date (yyyy-m-d hh:mm:ss ex 2019-12-21 00:00:00)
  * @param {string} end_date.query.required End Date (yyyy-m-d hh:mm:ss ex 2019-12-21 23:59:59)
  * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
  * @produces application/json
  * @consumes application/x-www-form-urlencoded
  * @security JWT
  */
exports.postListTransaction  = (req, res) => {
  var response = { success: false, message: 'Insufficient Privileges' }
  var userId = req.userId
  var id = req.query.store_id
  var companyId = req.companyId

  var start_date = req.query.start_date
  var end_date = req.query.end_date
  var dataSelectMaster = {}
  dataSelectMaster.store_id = id
  getFromTable('m_operasional', dataSelectMaster).then(
    async (success) => {
      await Promise.all(
        success.map(rows => {
          var dataInsert = {}
          dataInsert.store_id = id
          dataInsert.key_operasional = rows.key
          dataInsert.value_operasional = rows.value
          dataInsert.start_periode = start_date
          dataInsert.end_periode = end_date
          dataInsert.withdraw_by = userId
          insertToTable('t_operasional', dataInsert).then(
            (success) => {
              var update = `UPDATE transaction SET transaction.is_withdraw_operasional = true
                            WHERE
                            transaction.store_id = ${id}
                            AND transaction.is_withdraw_operasional = false
                            AND transaction.date_created between '${start_date}' and '${end_date}'`
              let exeUpdate = rawQuery(update);
            },
            (error) => {}
          )
        })
      )

      response.success = true
      response.message = 'Withdrawal Success'
      Utils.sendStatus(res, 200, response)
    },
    (error) => {
      response.success = false
      response.message = 'An Error Occured'
      response.error = error
      Utils.sendStatus(res, 200, response)
    }
  )
}

 /**
  * @route GET /list_withdraw_operasional
  * @group Operasional
  * @param {integer} store_id.query Store Id
  * @param {string} start_date.query.required Start Date (yyyy-m-d hh:mm:ss ex 2019-12-21 00:00:00)
  * @param {string} end_date.query.required End Date (yyyy-m-d hh:mm:ss ex 2019-12-21 23:59:59)
  * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
  * @produces application/json
  * @consumes application/x-www-form-urlencoded
  * @security JWT
  */
 exports.getListTransaction = (req, res) => {
   var response = { success: false, message: 'Insufficient Privileges' }
   var id = req.query.store_id
   var companyId = req.companyId

   var start_date = req.query.start_date
   var end_date = req.query.end_date
   var queryList = ""

   queryList = `SELECT * FROM transaction
             INNER JOIN trxproducts on trxproducts.transaction_id = transaction.id
             INNER JOIN stores on stores.id = transaction.store_id
             WHERE
             stores.id = ${id}
             AND transaction.is_withdraw_operasional = false
             AND transaction.date_created between '${start_date}' and '${end_date}'`


   response.success = true
   response.message = 'Success Get List Transaction'
   response.data = {}

   rawQuery(queryList).then(
     (success) => {
       response.data = success
       Utils.sendStatus(res, 200, response)
     },
     (error) => {
       response.success = false
       response.message = 'Failed Get List Transaction'
       Utils.sendStatus(res, 200, response)
     }
   )
  }




  /**
   * @route GET /operasional
   * @group Operasional
   * @param {integer} store_id.query Store Id
   * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
   * @produces application/json
   * @consumes application/x-www-form-urlencoded
   * @security JWT
   */
exports.getListOperasional = (req, res) => {
  var response = { success: false, message: 'Insufficient Privileges' }
  var userId = req.userId
  var storeId = req.query.store_id

  var dataSelect = {}
  dataSelect.store_id = storeId

  getFromTable('m_operasional', dataSelect).then(
    (success) => {
      response.success = true
      response.message = 'List Operasional'
      response.data = success
      Utils.sendStatus(res, 200, response)
    },
    (error) => {
      response.success = false
      response.message = 'Failed Get List Transaction'
      Utils.sendStatus(res, 200, response)
    }
  )
}

/**
 * @route POST /operasional
 * @group Operasional
 * @param {integer} store_id.query.required Store Id
 * @param {string} key.query.required Label Operasional
 * @param {integer} value.query.required Value Operasional
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.createOperasional = (req, res) => {
  var response = { success: false, message: 'Insufficient Privileges' }
  var userId = req.userId

  var storeId = req.query.store_id
  var key = req.query.key
  var value = req.query.value

  var dataInsert = {}
  dataInsert.store_id = storeId
  dataInsert.key = key
  dataInsert.value = value
  dataInsert.created_by = userId

  insertToTable('m_operasional', dataInsert).then(
    (success) => {
      response.success = true
      response.message = 'Success Create Operasional'
      response.data = success
      Utils.sendStatus(res, 200, response)
    },
    (error) => {
      response.success = false
      response.message = 'Failed Get List Transaction'
      Utils.sendStatus(res, 200, response)
    }
  )
}

/**
 * @route PUT /operasional
 * @group Operasional
 * @param {integer} store_id.query.required Store Id
 * @param {string} key.query.required Label Operasional
 * @param {integer} value.query.required Value Operasional
 * @param {integer} operasional_id.query.required Id Operasional
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.updateOperasional = (req, res) => {
  var response = { success: false, message: 'Insufficient Privileges' }
  var userId = req.userId

  var storeId = req.query.store_id
  var operasionalId = req.query.operasional_id
  var key = req.query.key
  var value = req.query.value

  var dataCondition = {}
  dataCondition.id = operasionalId
  dataCondition.store_id = storeId

  var dataUpdate = {}
  dataUpdate.key = key
  dataUpdate.value = value

  updateToTable('m_operasional', dataCondition, dataUpdate).then(
    (success) => {
      response.success = true
      response.message = 'Success Update Operasional'
      response.data = success
      Utils.sendStatus(res, 200, response)
    },
    (error) => {
      response.success = false
      response.message = 'Failed Get List Transaction'
      Utils.sendStatus(res, 200, response)
    }
  )
}

/**
 * @route DELETE /operasional
 * @group Operasional
 * @param {integer} operasional_id.query Id Operasional
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.deleteOperasional = (req, res) => {
  var response = { success: false, message: 'Insufficient Privileges' }
  var userId = req.userId
  var operasionalId = req.query.operasional_id

  var dataSelect = {}
  dataSelect.id = operasionalId
  deleteFromTable('m_operasional', dataSelect).then(
    (success) => {
      response.success = true
      response.message = 'Success Delete Operasional'
      response.data = success
      Utils.sendStatus(res, 200, response)
    },
    (error) => {
      response.success = false
      response.message = 'Failed Delete Operasional'
      Utils.sendStatus(res, 200, response)
    }
  )
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

 function deleteFromTable(table, dataSelect){
   return new Promise(function(resolve, reject) {
     try {
        db(table)
          .where(dataSelect)
          .del();
        resolve(true)
     } catch (e) {
        reject(e);
     }
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
