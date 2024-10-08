'use strict'
var config = require('../../tools/config');
var db = require('../../knex/knex');
var Utils = require('../utils/utils');
/**
 * @route GET /revenue_user
 * @group Revenue
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.byUser = (req, res) => {
    var userId = req.userId
    var storeId = req.storeId
    var response = { success: false, message: 'Failed Getting Data' }
    db('trxproducts')
        .columns([
            db.raw('count(*) as total_transaksi, sum(products.price * trxproducts.qty) AS total'),
        ])
        .join('products', { 'trxproducts.product_id': 'products.id' })
        .where({
            'trxproducts.created_by': userId,
            'products.store_id' : storeId
        })
        .whereRaw('DATE(trxproducts.date_created) = CURDATE()')
        .then(rows => {
            response = { success: true, message: 'Success Getting Revenue', data: rows }
        })
        .catch(error => {
            response = { success: false, message: 'Failed Getting Data', data: error }
        })
        .finally(() => {
            Utils.sendStatus(res, 200, response)
        })
}

/**
 * @route GET /revenue_store
 * @group Revenue
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */

exports.byStores = (req, res) => {
    var userId = req.userId
    var storeId = req.storeId
    var response = { success: false, message: 'Failed Getting Data' }
    db('trxproducts')
        .columns([
            db.raw('count(*) as total_transaksi, sum(products.price * trxproducts.qty) AS total'),
        ])
        .join('products', { 'trxproducts.product_id': 'products.id' })
        .where({
            'products.store_id' : storeId
        })
        .whereRaw('DATE(trxproducts.date_created) = CURDATE()')
        .then(rows => {
            response = { success: true, message: 'Success Getting Revenue', data: rows }
        })
        .catch(error => {
            response = { success: false, message: 'Failed Getting Data', data: error }
        })
        .finally(() => {
            Utils.sendStatus(res, 200, response)
        })
}

/**
 * @route GET /revenue_company
 * @group Revenue
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.byCompany = (req, res) => {
    var company_id = req.companyId
    var response = { success: false, message: 'Failed Getting Data' }
    db('trxproducts')
        .columns([
            db.raw('count(*) as total_transaksi, sum(products.price * trxproducts.qty) AS total'),
        ])
        .join('products', { 'trxproducts.product_id': 'products.id' })
        .join('stores', { 'products.store_id': 'stores.id' })
        .join('company', { 'stores.company_id': 'company.id' })
        .where({
            'company.id': company_id,
        })
        .whereRaw('DATE(trxproducts.date_created) = CURDATE()')
        .then(rows => {
            response = { success: true, message: 'Success Getting Revenue', data: rows }
        })
        .catch(error => {
            response = { success: false, message: 'Failed Getting Data', data: error }
        })
        .finally(() => {
            Utils.sendStatus(res, 200, response)
        })

}
