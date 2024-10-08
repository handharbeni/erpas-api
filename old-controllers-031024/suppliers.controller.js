'use strict'
var config = require('../../tools/config');
var db = require('../../knex/knex');
var Utils = require('../utils/utils');


/**
 * @route GET /suppliers
 * @group Suppliers
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.getSuppliers = (req, res) => {
    var storeId = req.storeId
    var response = { success: false, message: 'Failed Getting Data' }
    var dataCondition = {
        store_id: storeId
    }
    if(storeId != 0){
        db('suppliers')
        .where(dataCondition)
        .then(rows => {
            response = { success: true, message: 'Succes Getting Data', data: rows }
        })
        .catch(error => {
            response = { success: false, message: 'Failed Getting Data', data: error }
        })
        .finally(() => {
            Utils.sendStatus(res, 200, response)
        });
    }else{
        response = { success: false, message: 'Invalid Token' }
        Utils.sendStatus(res, 200, response);
    }
}

/**
 * @route POST /suppliers
 * @group Suppliers
 * @param {string} name.query.required - Supplier Name
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.postSuppliers = (req, res) => {
    var userId = req.userId
    var storeId = req.storeId
    var response = { success: false, message: 'Failed Inserting Data' }
    var dataInsert = {
        name : req.query.name,
        created_by: userId,
        modified_by: userId,
        store_id: storeId
    }
    if(storeId != 0){
        db('suppliers')
        .insert(dataInsert)
        .returning('id')
        .then(rowsInsert => {
            response = { success: true, message: 'Succes Inserting Data', data: rowsInsert }
        })
        .catch(error => {
            response = { success: false, message: 'Failed Inserting Data', data: error }
        })
        .finally(() => {
            Utils.sendStatus(res, 200, response)
        });
    }else{
        response = { success: false, message: 'Invalid Token' }
        Utils.sendStatus(res, 200, response);
    }
}


/**
 * @route PUT /suppliers
 * @group Suppliers
 * @param {string} supplier_id.query.required - Supplier Id
 * @param {string} name.query.required - Supplier Name
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.putSuppliers = (req, res) => {
    var userId = req.userId
    var storeId = req.storeId
    var response = { success: false, message: 'Failed Updating Data' }
    var dataCondition = {
        id: req.query.supplier_id,
        store_id: storeId
    }
    var dataUpdate = {
        name : req.query.name,
        modified_by: userId
    }
    if(storeId != 0){
        db('suppliers')
        .where(dataCondition)
        .update(dataUpdate)
        .then(rowsInsert => {
            response = { success: true, message: 'Succes Updating Data', data: rowsInsert }
        })
        .catch(error => {
            response = { success: false, message: 'Failed Updating Data', data: error }
        })
        .finally(() => {
            Utils.sendStatus(res, 200, response)
        });
    }else{
        response = { success: false, message: 'Invalid Token' }
        Utils.sendStatus(res, 200, response);
    }
}

/**
 * @route DELETE /suppliers
 * @group Suppliers
 * @param {string} supplier_id.query.required - Supplier Id
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.deleteSuppliers = (req, res) => {
    var storeId = req.storeId
    var response = { success: false, message: 'Failed Deleting Data' }
    var dataCondition = {
        id: req.query.supplier_id,
        store_id: storeId
    }
    if(storeId != 0){
        db('suppliers')
        .where(dataCondition)
        .del()
        .then(rowsInsert => {
            response = { success: true, message: 'Succes Deleting Data', data: rowsInsert }
        })
        .catch(error => {
            response = { success: false, message: 'Failed Deleting Data', data: error }
        })
        .finally(() => {
            Utils.sendStatus(res, 200, response)
        });
    }else{
        response = { success: false, message: 'Invalid Token' }
        Utils.sendStatus(res, 200, response);
    }
}