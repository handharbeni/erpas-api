'use strict'
var jwt = require('jsonwebtoken');
var config = require('../../tools/config');
var db = require('../../knex/knex');
var Utils = require('../utils/utils');
var bcrypt = require('bcryptjs');

/**
 * @route POST /pay/retribution
 * @group Payment
 * @param {string} month.query.required - Month
 * @param {string} year.query.required - Year
 * @param {string} store_id.query.required - Store ID
 * @param {string} price.query.required - price
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.payRetribution = (req, res) => {
    var response = {};
    var userId = req.userId

    var month = req.query.month
    var year = req.query.year
    var storeId = req.query.store_id
    var price = req.query.price

    var dataInsert = {
        user_id: userId,
        month: month,
        year: year,
        store_id: storeId,
        price: price,
        status: true
    }

    db('store_retribution')
        .insert(dataInsert)
        .returning('id')
        .then((rows) => {
            response = { success: true, message: 'Payment Success', data: rows }
        })
        .catch(error => {
            response = { success: false, message: 'Error on Payment', data: error }
        })
        .finally(() => {
            Utils.sendStatus(res, 200, response);
        });
}


/**
 * @route POST /pay/rent
 * @group Payment
 * @param {string} store_transaction_id.query.required - Store Transaction Id
 * @param {string} price.query.required - price
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.payRent = (req, res) => {
    var response = {};
    var userId = req.userId

    var storeTransactionId = req.query.store_transaction_id
    var price = req.query.price

    var dataInsert = {
        user_id: userId,
        store_transaction_id: storeTransactionId,
        price: price,
        status: true
    }

    db('store_payment')
        .insert(dataInsert)
        .returning('id')
        .then((rows) => {
            response = { success: true, message: 'Payment Success', data: rows }
        })
        .catch(error => {
            response = { success: false, message: 'Error on Payment', data: error }
        })
        .finally(() => {
            Utils.sendStatus(res, 200, response);
        });
}