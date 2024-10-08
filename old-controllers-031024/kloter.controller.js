'use strict'
var jwt = require('jsonwebtoken');
var config = require('../../tools/config');
var db = require('../../knex/knex');
var Utils = require('../utils/utils');
var bcrypt = require('bcryptjs');



/**
 * @route POST /investor
 * @group Investor
 * @param {string} email.query.required - Email
 * @param {string} password.query.required - Password
 * @param {string} list_outlet.query.required - List Outlet : [1, 2, 3]
 * @param {string} percentage.query.required - Percentage
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.createInvestor = (req, res) => {
  var table = 'users'

  var response = {}

  var pEmail = req.query.email
  var pPassword = req.query.password
  var pIsInvestor = true
  var pListOutlet = req.query.list_outlet
  var pPercentage = req.query.percentage
  var companyId = req.companyId
  if (companyId != 0) {
    var dataSelect = {
      email: pEmail,
      id_company: companyId
    }
    var dataInsert = {
      username: pEmail,
      email: pEmail,
      password: bcrypt.hashSync(pPassword, 8),
      is_investor: pIsInvestor,
      list_outlet: pListOutlet,
      id_company: companyId,
      percentage: pPercentage
    }
    let checkDuplicate = getFromTable(table, dataSelect)

    checkDuplicate.then(
      (result) => {
        if (result.length < 1) {
          let insertInvestor = insertToTable(table, dataInsert)
          insertInvestor.then(
            (success) => {
              response = { success: true, message: 'Success Insert', data: success }
              Utils.sendStatus(res, 200, response)
            },
            (error) => {
              response = { success: false, message: 'Failed To Insert', data: error }
              Utils.sendStatus(res, 200, response)
            }
          )
        }else{
          response = { success: false, message: 'Account Already Exists' }
          Utils.sendStatus(res, 200, response)
        }
      },
      (error) => {
        response = { success: false, message: 'Failed Getting Data', data: resultInsert }
        Utils.sendStatus(res, 200, response)
      }
    )
  }else{
      response = { success: false, message: `You Don't Have Privileges In This Company` }
      Utils.sendStatus(res, 200, response)
  }
}


/**
 * @route GET /investor
 * @group Investor
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.listInvestor = (req, res) => {
  var response = {}
  var companyId = req.companyId
  if (companyId != 0) {
    var table = 'users'
    var dataSelect = {
      id_company: companyId
    }
    let getListInvestor = getFromTable(table, dataSelect)
    getListInvestor.then(
      (success) => {
        response = { success: true, message: 'Success Get Data', data: success }
        Utils.sendStatus(res, 200, response)
      },
      (error) => {
        response = { success: false, message: 'Failed Getting Data', data: resultInsert }
        Utils.sendStatus(res, 200, response)
      }
    )
  }else{
    response = { success: false, message: `You Don't Have Privileges In This Company` }
    Utils.sendStatus(res, 200, response)
  }
}

/**
 * @route PUT /investor
 * @group Investor
 * @param {string} id_investor.query.required - Id Investor
 * @param {string} percentage.query.required - Percentage
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.updateInvestor = (req, res) => {
  var response = {}
  var table = 'users'
  var companyId = req.companyId
  var pIdInvestor = req.query.id_investor
  var pPercentage = req.query.percentage
  var dataSelect = {
    id_company: companyId,
    is_investor: true,
    id: pIdInvestor
  }
  var dataUpdate = {
    percentage: pPercentage
  }
  if (companyId != 0) {
    let updateInvestor = updateToTable(table, dataSelect, dataUpdate)
    updateInvestor.then(
      (success) => {
        response = { success: true, message: 'Success Update Data', data: success }
        Utils.sendStatus(res, 200, response)
      },
      (error) => {
        response = { success: false, message: 'Failed Update Data', data: error }
        Utils.sendStatus(res, 200, response)
      }
    )
  }else{
    response = { success: false, message: `You Don't Have Privileges In This Company` }
    Utils.sendStatus(res, 200, response)
  }
}

/**
 * @route POST /kloter
 * @group Kloter
 * @param {string} nama_kloter.query.required - Nama Kloter
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.createKloter = (req, res) => {
  var response = {}
  var table = 'master_kloter'
  var companyId = req.companyId
  var namaKloter = req.query.nama_kloter

  var dataInsert = {
    nama_kloter: namaKloter,
    id_company: companyId,
    isActive: true
  }

  if (companyId != 0) {
    let createKloter = insertToTable(table, dataInsert)
    createKloter.then(
      (success) => {
        response = { success: false, message: 'Success Create Kloter', data: success }
        Utils.sendStatus(res, 200, response)
      },
      (error) => {
        response = { success: false, message: 'Failed Getting Data', data: error }
        Utils.sendStatus(res, 200, response)
      }
    )
  }else{
    response = { success: false, message: `You Don't Have Privileges In This Company` }
    Utils.sendStatus(res, 200, response)
  }
}


/**
 * @route GET /kloter
 * @group Kloter
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.listKloter = (req, res) => {
  var response = {}
  var table = 'master_kloter'
  var companyId = req.companyId
  var dataSelect = {
    id_company: companyId,
    isActive: true
  }
  if(companyId != 0){
    let getListKloter = getFromTable(table, dataSelect)
    getListKloter.then(
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
    response = { success: false, message: `You Don't Have Privileges In This Company` }
    Utils.sendStatus(res, 200, response)
  }
}



/**
 * @route PUT /kloter
 * @group Kloter
 * @param {string} nama_kloter.query.required - Nama Kloter
 * @param {string} id_kloter.query.required - Id Kloter
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.updateKloter = (req, res) => {
  var response = {}
  var table = 'master_kloter'
  var companyId = req.companyId
  var namaKloter = req.query.nama_kloter
  var idKloter = req.query.id_kloter

  var dataSelect = {
    id: idKloter,
    id_company: companyId
  }

  var dataUpdate = {
    nama_kloter: namaKloter
  }

  if (companyId != 0) {
    let updateKloter = updateToTable(table, dataSelect, dataUpdate)
    updateKloter.then(
      (success) => {
        response = { success: false, message: 'Success Update Kloter', data: success }
        Utils.sendStatus(res, 200, response)
      },
      (error) => {
        response = { success: false, message: 'Failed Update Data', data: error }
        Utils.sendStatus(res, 200, response)
      }
    )
  }else{
    response = { success: false, message: `You Don't Have Privileges In This Company` }
    Utils.sendStatus(res, 200, response)
  }
}

/**
 * @route DELETE /kloter
 * @group Kloter
 * @param {string} id_kloter.query.required - Id Kloter
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.deleteKloter = (req, res) => {
  var response = {}
  var table = 'master_kloter'
  var companyId = req.companyId
  var namaKloter = req.query.nama_kloter
  var idKloter = req.query.id_kloter

  var dataSelect = {
    id: idKloter,
    id_company: companyId
  }

  var dataUpdate = {
    isActive: false
  }

  if (companyId != 0) {
    let updateKloter = updateToTable(table, dataSelect, dataUpdate)
    updateKloter.then(
      (success) => {
        response = { success: false, message: 'Success Delete Kloter', data: success }
        Utils.sendStatus(res, 200, response)
      },
      (error) => {
        response = { success: false, message: 'Failed Delete Data', data: error }
        Utils.sendStatus(res, 200, response)
      }
    )
  }else{
    response = { success: false, message: `You Don't Have Privileges In This Company` }
    Utils.sendStatus(res, 200, response)
  }
}


/**
 * @route POST /detailkloter
 * @group Detail Kloter
 * @param {string} id_kloter.query.required - Id Kloter
 * @param {string} list_investor.query.required - List Id Investor separated by comma (,)
 * @param {string} list_store.query.required - List Id Store separated by comma (,)
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.defineKloter = (req, res) => {
  var response = {}
  var companyId = req.companyId
  var idKloter = req.query.id_kloter
  var listInvestor = req.query.list_investor
  var listStore = req.query.list_store

  if (companyId != 0) {
    var aListInvestor = listInvestor.split(',')
    var aListStore = listStore.split(',')

    aListInvestor.forEach((item, index) =>{
      insertKloterUser(item, index, 'kloter_user', idKloter)
    })
    aListStore.forEach((item, index) => {
      insertKloterStore(item, index, 'kloter_store', idKloter)
    })

    response = { success: true, message: `Success Defining Kloter` }
    Utils.sendStatus(res, 200, response)
  }else{
    response = { success: false, message: `You Don't Have Privileges In This Company` }
    Utils.sendStatus(res, 200, response)
  }
}

/**
 * @route GET /detailkloter
 * @group Detail Kloter
 * @param {string} id_kloter.query.required - Id Kloter
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.detailKloter = (req, res) => {
  var response = {}
  var companyId = req.companyId
  var idKloter = req.query.id_kloter
  var arrayData = {}


  if (companyId != 0) {
    var queryUser = `SELECT users.* FROM kloter_user
                      INNER JOIN users on users.id = kloter_user.id_user
                      INNER JOIN master_kloter on kloter_user.id_kloter = master_kloter.id
                      where master_kloter.id = ${idKloter} AND master_kloter.id_company = ${companyId}`
    let rawQueryUser = rawQuery(queryUser)
    rawQueryUser.then(
      (success) => {
        arrayData.user = success
        var queryStore = `SELECT stores.* FROM kloter_store
        INNER JOIN stores on stores.id = kloter_store.id_store
        INNER JOIN master_kloter on master_kloter.id = kloter_store.id_kloter
        WHERE master_kloter.id = ${idKloter} AND master_kloter.id_company = ${companyId}`
        let rawQueryStore = rawQuery(queryStore)
        rawQueryStore.then(
          (success) => {
            arrayData.store = success
            response = { success: true, message: `Succes Getting Data`, data: arrayData }
            Utils.sendStatus(res, 200, response)
          },
          (error) => {
            response = { success: false, message: `Failed Getting Data`}
            Utils.sendStatus(res, 200, response)
          }
        )
      },
      (error) => {
        response = { success: false, message: `Failed Getting Data`}
        Utils.sendStatus(res, 200, response)
      }
    )

  }else{
    response = { success: false, message: `You Don't Have Privileges In This Company` }
    Utils.sendStatus(res, 200, response)
  }
}


function insertKloterUser(item, index, table, idKloter){
  var dataInsert = {
    id_user: item,
    id_kloter: idKloter,
    percentage: 0
  }
  let checkDuplicate = getFromTable(table, dataInsert)
  checkDuplicate.then(
    (success) => {
        if (success.length < 1) {
          insertToTable(table, dataInsert)
        }
    },
    (error) => {}
  )

}

function insertKloterStore(item, index, table, idKloter){
  var dataInsert = {
    id_store: item,
    id_kloter: idKloter
  }
  let checkDuplicate = getFromTable(table, dataInsert)
  checkDuplicate.then(
    (success) => {
        if (success.length < 1) {
          insertToTable(table, dataInsert)
        }
    },
    (error) => {}
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
