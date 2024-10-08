'use strict'
var config = require('../../tools/config');
var db = require('../../knex/knex');
var Utils = require('../utils/utils');


/**
 * @route GET /company
 * @group Company
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.getCompany = (req, res) => {
    var userId = req.userId
    var response = {}
    var dataSelect = {
        owner_id: userId
    }
    db('company')
        .where(dataSelect)
        .then(rows => {
            response = { success: true, message:'Success Getting Info', data: rows }
        })
        .catch(error => {
            response = { success: false, message:'Failed Getting Info', data: error }
        })
        .finally(() => {
           Utils.sendStatus(res, 200, response)
        });
}


/**
 * @route POST /company
 * @group Company
 * @param {string} company_name.query.required - Company Name
 * @param {string} company_address.query.required - Company Address
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.createCompany = (req, res) => {
    var userId = req.userId
    var response = {}
    var dataSelect = {
        name: req.query.company_name,
        owner_id: userId
    }
    var dataCreate = {
        name: req.query.company_name,
        address: req.query.company_address,
        owner_id: userId,
        subscription_type: 0,
        subscription_end: new Date()
    }
    db('company')
        .where(dataSelect)
        .then(async (rows) => {
            if(rows.length < 1){
                await db('company')
                    .insert(dataCreate)
                    .then(rows => {
                        response = { success: true, message: 'Succesfully Create Company' }
                    })
                    .catch(error => {
                        response = { success: false, message: 'Failed Create Company', data: error}
                    })
            }else{
                response = { success: false, message: 'Company Already Exist'}
            }
        })
        .catch(error => {
            response = { success: false, message: 'Failed Create Company', data: error }
        })
        .finally(() => {
            Utils.sendStatus(res, 200, response)
        })
}

/**
 * @route PUT /company
 * @group Company
 * @param {string} company_id.query.required - Company Id
 * @param {string} company_name.query.required - Company Name
 * @param {string} company_address.query.required - Company Address
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.putCompany = (req, res) => {
    var userId = req.userId
    var response = {}
    var dataSelect = {
        id: req.query.company_id,
        owner_id: userId
    }
    var dataUpdate = {
        name: req.query.company_name,
        address: req.query.company_address
    }
    db('company')
        .where(dataSelect)
        .update(dataUpdate)
        .then(rows => {
            response = { success: true, message: 'Succesfully Update Company' }
        })
        .catch(error => {
            response = { success: false, message: 'Failed Update Company'}
        })
        .finally(() => {
            Utils.sendStatus(res, 200, response)
        })
}

/**
 * @route DELETE /company
 * @group Company
 * @param {string} company_id.query.required - Company Id
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.deleteCompany = (req, res) => {
    var userId = req.userId
    var response = {}
    var dataSelect = {
        id: req.query.company_id,
        owner_id: userId
    }
    db('company')
        .where(dataSelect)
        .del()
        .then(rows => {
            response = { success: true, message: 'Succesfully Delete Company' }
        })
        .catch(error => {
            response = { success: false, message: 'Failed Delete Company'}
        })
        .finally(() => {
            Utils.sendStatus(res, 200, response)
        })
}
