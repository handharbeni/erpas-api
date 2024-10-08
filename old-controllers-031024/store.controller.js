'use strict'
var config = require('../../tools/config');
var db = require('../../knex/knex');
var Utils = require('../utils/utils');

/**
 * @route GET /stores
 * @group Stores
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.getStore = (req, res) => {
    var response = {}
    var userId = req.userId
    var companyId = req.companyId
    var dataSelect = {
        id: companyId,
        owner_id: userId
    }
    if(companyId != 0){
        db('company')
            .where(dataSelect)
            .then(async (rows) => {
                if(rows.length > 0){
                    var dataCondition = {
                        company_id: companyId
                    }
                    await db('stores')
                        .where(dataCondition)
                        .then(sRows => {
                            response = { success: true, message: `Success Getting Data`, data: sRows }
                        })
                        .catch(error => {
                            response = { success: false, message: `Error Getting Data`, data: error }
                        });
                }else{
                    response = { success: false, message: `You Don't Have Privileges In This Companys` }
                }
            })
            .catch(error => {
                response = { success: false, message: `Error Getting Data`, data: error }
            })
            .finally(() => {
                Utils.sendStatus(res, 200, response)
            });
    }else{
        response = { success: false, message: `You Don't Have Privileges In This Company` }
        Utils.sendStatus(res, 200, response)
    }
}

/**
 * @route POST /stores
 * @group Stores
 * @param {string} name.query.required - Name
 * @param {string} address.query.required - Address
 * @param {string} store_type.query.required - Store Type
 * @param {string} status.query.required - Status
 * @param {string} open.query.required - Open
 * @param {string} close.query.required - Close
 * @param {integer} pray_time_active.query.required - Pray Time Toggle
 * @param {integer} time_before.query.required - Time Before for Popup Show
 * @param {integer} time_after.query.required - Time After for Popup Hide
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.postStore = (req, res) => {
    var response = {}
    var userId = req.userId
    var companyId = req.companyId

    var dataSelect = {
        id: companyId,
        owner_id: userId
    }
    if(companyId != 0){
        db('company')
            .where(dataSelect)
            .then(async (rows) => {
                if(rows.length > 0){
                    var dataInsert = {
                        name: req.query.name,
                        address: req.query.address,
                        store_type: req.query.store_type,
                        status: req.query.status,
                        open: req.query.open,
                        close: req.query.close,
                        company_id: companyId,
                        created_by: userId,
                        modified_by: userId,
                        pray_time_active: req.query.pray_time_active,
                        time_before: req.query.time_before,
                        time_after: req.query.time_after
                    }
                    await db('stores')
                            .insert(dataInsert)
                            .returning('id')
                            .then( async (sRows) => {
                                var dataInsert = {
                                    user_id: userId,
                                    store_id: sRows[0],
                                    isOwner: 1
                                }
                                await db('employee')
                                    .insert(dataInsert)
                                    .then(sRowsEmployee => {
                                        response = { success: true, message: `Success Insert Data`, data: sRows }
                                    })
                                    .catch(error => {
                                        response = { success: true, message: `Error Insert Data`, data: error }
                                    });
                            })
                            .catch(error => {
                                response = { success: true, message: `Error Insert Data`, data: error }
                            });
                }else{
                    response = { success: false, message: `You Don't Have Privileges In This Company` }
                }
            })
            .catch(error => {
                response = { success: true, message: `Error Inserting Data`, data: error }
            })
            .finally(() => {
                Utils.sendStatus(res, 200, response)
            });
    }else{
        response = { success: false, message: `You Don't Have Privileges In This Company` }
        Utils.sendStatus(res, 200, response)
    }
}


/**
 * @route PUT /stores
 * @group Stores
 * @param {string} name.query.required - Name
 * @param {string} address.query.required - Address
 * @param {string} store_type.query.required - Store Type
 * @param {string} status.query.required - Status
 * @param {string} open.query.required - Open
 * @param {string} close.query.required - Close
 * @param {integer} store_id.query.required - Store Id
 * @param {boolean} pray_time_active.query.required - Pray Time Toggle
 * @param {integer} time_before.query.required - Time Before for Popup Show
 * @param {integer} time_after.query.required - Time After for Popup Hide
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.putStore = (req, res) => {
    var response = {}
    var userId = req.userId
    var companyId = req.companyId

    var dataSelect = {
        id: companyId,
        owner_id: userId
    }
    if(companyId != 0){
        db('company')
            .where(dataSelect)
            .then(async (rows) => {
                if(rows.length > 0){
                    var dataCondition = {
                        company_id: companyId,
                        id: req.query.store_id
                    }
                    var dataUpdate = {
                        name: req.query.name,
                        address: req.query.address,
                        store_type: req.query.store_type,
                        status: req.query.status,
                        open: req.query.open,
                        close: req.query.close,
                        pray_time_active: req.query.pray_time_active,
                        time_before: req.query.time_before,
                        time_after: req.query.time_after
                    }
                    await db('stores')
                            .where(dataCondition)
                            .update(dataUpdate)
                            .returning('id')
                            .then(sRows => {
                                response = { success: true, message: `Success Update Data`, data: sRows }
                            })
                            .catch(error => {
                                response = { success: true, message: `Error Update Data`, data: error }
                            })
                }else{
                    response = { success: false, message: `You Don't Have Privileges In This Company` }
                }
            })
            .catch(error => {
                response = { success: true, message: `Error Updating Data`, data: error }
            })
            .finally(() => {
                Utils.sendStatus(res, 200, response)
            });
    }else{
        response = { success: false, message: `You Don't Have Privileges In This Company` }
        Utils.sendStatus(res, 200, response)
    }
}

/**
 * @route DELETE /stores
 * @group Stores
 * @param {integer} store_id.query.required - Store Id
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.deleteStore = (req, res) => {
    var response = {}
    var userId = req.userId
    var companyId = req.companyId

    var dataSelect = {
        id: companyId,
        owner_id: userId
    }
    if(companyId != 0){
        db('company')
            .where(dataSelect)
            .then(async (rows) => {
                if(rows.length > 0){
                    var dataDelete = {
                        company_id: companyId,
                        id: req.query.store_id
                    }
                    await db('stores')
                            .where(dataDelete)
                            .del();
                    response = { success: true, message: `Success Delete Data` }
            }else{
                    response = { success: false, message: `You Don't Have Privileges In This Company` }
                }
            })
            .catch(error => {
                response = { success: true, message: `Error Deleting Data`, data: error }
            })
            .finally(() => {
                Utils.sendStatus(res, 200, response)
            });
    }else{
        response = { success: false, message: `You Don't Have Privileges In This Company` }
        Utils.sendStatus(res, 200, response)
    }
}

/**
 * @route GET /customer
 * @group Stores
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.getCustomer = (req, res) => {
    var store_id = req.storeId
    var response = { success: false, message: 'Failed Getting Data' }
    db('transaction')
        .distinct('buyer')
        .where({
            store_id: store_id
        })
        .then(rows => {
            response = { success: true, message: 'Success Getting Customers', data: rows }
        })
        .catch(error => {
            response = { success: false, message: 'Failed Getting Data', data: error }
        })
        .finally(() => {
            Utils.sendStatus(res, 200, response)
        })
}
