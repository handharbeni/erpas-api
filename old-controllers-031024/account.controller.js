'use strict'
var jwt = require('jsonwebtoken');
var config = require('../../tools/config');
var db = require('../../knex/knex');
var Utils = require('../utils/utils');
var bcrypt = require('bcryptjs');

/**
 * @route POST /register
 * @group User
 * @param {string} email.query.required - Email
 * @param {string} password.query.required - Password
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 */
exports.register = (req, res) => {
    var response = {};
    var dataSelect = {
        email: req.query.email
    }
    var dataInsert = {
        email: req.query.email,
        username: req.query.email,
        password: bcrypt.hashSync(req.query.password, 8)
    }

    db('users')
        .where(dataSelect)
        .then(async (rows) => {
            if(rows.length > 0){
                response = { success: false, message:'Email Already Taken' }
            }else{
                await db('users')
                        .insert(dataInsert)
                        .returning('id')
                        .then(resultInsert => {
                            response = { success: true, message:'Register Success, You Can Login', data: resultInsert }
                        })
                        .catch(error => {
                            response = { success: false, message: 'Failed To Register', data: error }
                        });
            }
        })
        .catch(error => {
            response = { success: false, message: 'Failed To Register', data: error }
        })
        .finally(() => {
            Utils.sendStatus(res, 200, response)
        });
}

/**
 * @route POST /login
 * @group User
 * @param {string} email.query.required - Email
 * @param {string} password.query.required - Password
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 */
exports.login = (req, res) => {
    var response = {};
    var password = req.query.password
    var dataSelect = {
        email: req.query.email
    }
    db('users')
        .where(dataSelect)
        .then(rows => {
            if(rows.length > 0){
                var passwordIsValid = bcrypt.compareSync(password, rows[0].password);
                if(!passwordIsValid){
                    response = { success: false, message:'Email / Password Invalid' }
                }else{
                    var tokens = jwt.sign({ id: rows[0].id, store_id: 0, company_id: 0, is_investor:rows[0].is_investor }, config.secret, {
                        expiresIn: config.expiresSession
                    });
                    var bodyResponse = [];
                    bodyResponse.push({
                        token: tokens,
                        name: rows[0].name,
                        identity_number: rows[0].identity_number,
                        address: rows[0].address,
                        phone_number: rows[0].phone_number,
                        email: rows[0].email,
                        image: rows[0].image
                    });
                    response = { success: true, message: 'Login Success', data: bodyResponse }
                }
            }else{
                response = { success: false, message:'User Not Found' }
            }
        })
        .catch(error => {
            response = { success: false, message: 'Failed Get Data', data: error }
        })
        .finally(() => {
            Utils.sendStatus(res, 200, response)
        });
}

/**
 * @route GET /me
 * @group User
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.getMe = (req, res) => {
    var response = {};
    var userId = req.userId
    var dataSelect = {
        id: userId
    }
    db('users')
        .where(dataSelect)
        .then(rows => {
            if(rows.length > 0){
                response = { success: true, message: 'Success Get Data', data: rows }
            }else{
                response = { success: false, message: 'Failed Get Data' }
            }
        })
        .catch(error => {
            response = { success: false, message: 'Failed Fetching Data', data: error }
        })
        .finally(() => {
            Utils.sendStatus(res, 200, response);
        });
}

/**
 * @route PUT /me
 * @group User
 * @param {string} name.query.required - Name
 * @param {string} identity_number.query.required - Identity Number
 * @param {string} address.query.required - Address
 * @param {string} phone_number.query.required - Phone Number
 * @param {string} image.query.required - Image
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.updateMe = (req, res) => {
    var response = {}
    var userId = req.userId
    var dataCondition = {
        id: userId
    }
    var dataUpdate = {
        name: req.query.name,
        identity_number: req.query.identity_number,
        address: req.query.address,
        phone_number: req.query.phone_number,
        image: req.query.image
    }
    db('users')
        .where(dataCondition)
        .update(dataUpdate)
        .returning('id')
        .then(rows => {
            response = { success: true, message: 'Success Update Data', data: rows }
        })
        .catch(error => {
            response = { success: false, message: 'Failed Update Data', data: error }
        })
        .finally(() => {
            Utils.sendStatus(res, 200, response);
        });
}

/**
 * @route GET /assignstore
 * @group User
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.getAssignStore = (req, res) => {
    var userId = req.userId
    var response = {}
    var dataSelect = {
        user_id: userId
    }

    db.select('stores.*')
        .from('employee')
        .join('users', 'employee.user_id', '=', 'users.id')
        .join('stores', 'employee.store_id', '=', 'stores.id')
        .where(dataSelect)
        .where('store_id', '!=', '0')
        .then(rows => {
            response = { success: true, message: 'Success Get Data Store', data: rows}
        })
        .catch(error => {
            response = { success: false, message: 'Failed Get Store', data: error }
        })
        .finally(() => {
            Utils.sendStatus(res, 200, response)
        });
}

/**
 * @route GET /assigncompany
 * @group User
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.getAssignCompany = (req, res) => {
    var userId = req.userId
    var response = {}
    var dataSelect = {
        user_id: userId
    }

    db.select('company.*')
        .from('employee')
        .join('users', 'employee.user_id', '=', 'users.id')
        .join('company', 'employee.company_id', '=', 'company.id')
        .where(dataSelect)
        .where('company_id', '!=', '0')
        .then(rows => {
            response = { success: true, message: 'Success Get Data Company', data: rows}
        })
        .catch(error => {
            response = { success: false, message: 'Failed Get Company', data: error }
        })
        .finally(() => {
            Utils.sendStatus(res, 200, response)
        });
}

/**
 * @route POST /checkinstore
 * @group User
 * @param {integer} store_id.query.required Store Id
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.checkinStore = (req, res) => {
    var response = {}
    var userId = req.userId
    var storeId = req.query.store_id
    var dataSelect = {
            user_id: userId,
            store_id: storeId
    }
    db('employee')
        .where(dataSelect)
        .then(rows =>{
            if(rows.length > 0){
                var tokens = jwt.sign({ id: userId, store_id: storeId, company_id: 0 }, config.secret, {
                    expiresIn: config.expiresSession
                });
                var data = [];
                data.push({
                    newToken: tokens
                });
                response = { success: true, message: `You Have New Token`, data: data }
            }else{
                response = { success: false, message: `You Don't Have Access To It` }
            }
        })
        .catch(error =>{
            response = { success: false, message: `Failed Accesing Data`, data: error }
        })
        .finally(() => {
            Utils.sendStatus(res, 200, response);
        });
}
/**
 * @route POST /checkincompany
 * @group User
 * @param {integer} company_id.query.required Company Id
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.checkinCompany = (req, res) => {
    var response = {}
    var userId = req.userId
    var companyId = req.query.company_id
    var dataSelect = {
            user_id: userId,
            company_id: companyId
    }
    db('employee')
        .where(dataSelect)
        .then(rows =>{
            if(rows.length > 0){
                var tokens = jwt.sign({ id: userId, store_id: 0, company_id: rows[0].company_id }, config.secret, {
                    expiresIn: config.expiresSession
                });
                var data = [];
                data.push({
                    newToken: tokens
                });
                response = { success: true, message: `You Have New Token`, data: data }
            }else{
                response = { success: false, message: `You Don't Have Access To It` }
            }
        })
        .catch(error =>{
            response = { success: false, message: `Failed Accesing Data`, data: error }
        })
        .finally(() => {
            Utils.sendStatus(res, 200, response);
        });
}
/**
 * @route POST /checkinowncompany
 * @group User
 * @param {integer} company_id.query.required Company Id
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.checkinOwnCompany = (req, res) => {
    var response = {}
    var userId = req.userId
    var companyId = req.query.company_id
    var dataSelect = {
            owner_id: userId,
            id: companyId
    }
    db('company')
        .where(dataSelect)
        .then(rows =>{
            if(rows.length > 0){
                var tokens = jwt.sign({ id: userId, store_id: 0, company_id: rows[0].id }, config.secret, {
                    expiresIn: config.expiresSession
                });
                var data = [];
                data.push({
                    newToken: tokens
                });
                response = { success: true, message: `You Have New Token`, data: data }
            }else{
                response = { success: false, message: `You Don't Have Access To It` }
            }
        })
        .catch(error =>{
            response = { success: false, message: `Failed Accesing Data`, data: error }
        })
        .finally(() => {
            Utils.sendStatus(res, 200, response);
        });
}
/**
 * @route POST /checkinownstores
 * @group User
 * @param {integer} stores_id.query.required Stores Id
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */

exports.checkinOwnStores = (req, res) => {
    var response = {}
    var userId = req.userId
    var stores_id = req.query.stores_id
    var dataSelect = {
        'company.owner_id': userId,
        'stores.id': stores_id
    }
    db('stores')
        .join('company', {'company.id': 'stores.company_id'})
        .where(dataSelect)
        .then(rows => {
            if(rows.length > 0){
                var tokens = jwt.sign({ id: userId, store_id: stores_id, company_id: 0 }, config.secret, {
                    expiresIn: config.expiresSession
                });
                var data = [];
                data.push({
                    newToken: tokens
                });
                response = { success: true, message: `You Have New Token`, data: data }
            }else{
                response = { success: false, message: `You Don't Have Access To It` }
            }
        })
        .catch(error =>{
            response = { success: false, message: `Failed Accesing Data`, data: error }
        })
        .finally(() => {
            Utils.sendStatus(res, 200, response);
        });
}

/**
 * @route POST /checkout
 * @group User
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.checkout = (req, res) => {
    var userId = req.userId
    var tokens = jwt.sign({ id: userId, store_id: 0, company_id: 0 }, config.secret, {
        expiresIn: config.expiresSession
    });
    var bodyResponse = []
    bodyResponse.push({
        newToken: tokens
    });
    var response = { success: true, message:'You Have New Token', data: bodyResponse }
    Utils.sendStatus(res, 200, response);
}
