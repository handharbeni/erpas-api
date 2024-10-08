'use strict'
var jwt = require('jsonwebtoken');
var config = require('../../tools/config');
var db = require('../../knex/knex');
var Utils = require('../utils/utils');
var bcrypt = require('bcryptjs');

/**
 * @route POST /register
 * @group User
 * @param {string} username.query.required - Username
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
        username: req.query.username,
        password: bcrypt.hashSync(req.query.password, 8)
    }

    db('user')
        .where(dataSelect)
        .then(async (rows) => {
            if(rows.length > 0){
                response = { success: false, message:'Email Already Taken' }
            }else{
                await db('user')
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
 * @param {string} username.query.required - Username
 * @param {string} password.query.required - Password
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 */
exports.login = (req, res) => {
    var response = {};
    var password = req.query.password
    var dataSelect = {
        username: req.query.username
    }
    db('user')
        .where(dataSelect)
        .then(rows => {
            if(rows.length > 0){
                var passwordIsValid = bcrypt.compareSync(password, rows[0].password);
                if(!passwordIsValid){
                    response = { success: false, message:'Email / Password Invalid' }
                }else{
                    var tokens = jwt.sign({ id: rows[0].id }, config.secret, {
                        expiresIn: config.expiresSession
                    });
                    var bodyResponse = [];
                    bodyResponse.push({
                        token: tokens,
                        username: rows[0].username,
                        email: rows[0].email
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
    db('user')
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