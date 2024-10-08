'use strict'
var config = require('../../tools/config');
var db = require('../../knex/knex');
var Utils = require('../utils/utils');
/**
 * @typedef Products
 * @property {string} name.required - Some description for point - eg: 1234
 * @property {string} sku.required
 * @property {integer} store_id.required
 * @property {integer} category_id.required
 * @property {string} desc.required
 * @property {string} status.required
 * @property {string} image.required
 * @property {string} uom.required
 * @property {string} created_by.required
 * @property {string} modified_by.required
 * @property {string} date_created.required
 * @property {string} date_modified.required
 * @property {integer} company_id.required
 * @property {string} price.required
 * @property {string} buy_price.required
 */
 /**
  * @typedef PutProducts
  * @property {string} name.required
  * @property {string} sku.required - Some description for point - eg: 1234
  * @property {string} uom.required
  * @property {string} desc.required
  * @property {string} status.required
  * @property {string} image.required
  * @property {string} price.required
  * @property {string} buy_price.required
  * @property {integer} category_id.required
  * @property {string} product_id.required
  */

/**
 * @route GET /products
 * @group Products
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.getProduct = (req, res) => {
    var response = {}
    var userId = req.userId
    var storeId = req.storeId
    var companyId = req.companyId
    if(storeId == 0){
        response = { success: false, message: 'You Not Affiliate In Any Store Or Company' }
        Utils.sendStatus(res, 200, response);
    }else{
        var dataSelect = {
            store_id: storeId
            // company_id: companyId
        }
        db('products')
            .where(dataSelect)
            .then(rows => {
                response = { success: true, message: 'Success Get Products', data: rows }
            })
            .catch(error => {
                response = { success: false, message: 'Cannot Getting Data Products', data: error }
            })
            .finally(()=>{
                Utils.sendStatus(res, 200, response);
            });
    }

}
/**
 * @route POST /products
 * @group Products
 * @param {Products.model} Products.body.required - Update Products
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
exports.postProduct = (req, res) => {
    var response = {}
    var userId = req.userId
    var storeId = req.storeId
    var companyId = req.companyId
    if(storeId == 0 && companyId == 0){
        response = { success: false, message: 'You Not Affiliate In Any Store Or Company' }
        Utils.sendStatus(res, 200, response);
    }else{
        var objectBody = req.body;
        var dataInsert = {
            name: objectBody.name,
            sku: objectBody.sku,
            uom: objectBody.uom,
            desc: objectBody.desc,
            status: objectBody.status,
            image: objectBody.image,
            store_id: storeId,
            price: objectBody.price,
            buy_price: objectBody.buy_price,
            category_id: objectBody.category_id
        }
        db('products')
            .insert(dataInsert)
            .returning('id')
            .then(rows => {
                response = { success: true, message: 'Success Insert Products', data: rows }
            })
            .catch(error => {
                response = { success: false, message: 'Error Insert Products', data: error }
            })
            .finally(() => {
                Utils.sendStatus(res, 200, response);
            });
    }
}

/**
 * @route PUT /products
 * @group Products
 * @param {PutProducts.model} PutProducts.body.required - Update Products
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
exports.putProduct = (req, res) => {
    var response = {}
    var userId = req.userId
    var storeId = req.storeId
    var companyId = req.companyId
    if(storeId == 0){
        response = { success: false, message: 'You Not Affiliate In Any Store Or Company' }
        Utils.sendStatus(res, 200, response);
    }else{
        var objectBody = req.body;
        var dataSelect = {
            id: objectBody.product_id,
            store_id: storeId
        }
        // console.log(dataSelect);
        var dataUpdate = {
            name: objectBody.name,
            sku: objectBody.sku,
            uom: objectBody.uom,
            desc: objectBody.desc,
            status: objectBody.status,
            image: objectBody.image,
            price: objectBody.price,
            buy_price: objectBody.buy_price,
            category_id: objectBody.category_id
        }
        // console.log(dataUpdate);
        db('products')
            .where(dataSelect)
            .update(dataUpdate)
            .then(rows => {
              response = { success: true, message: 'Success Update Products', data: rows }
            })
            .catch(error => {
              response = { success: false, message: 'Error Update Products', data: error }
            })
            .finally(() => {
                Utils.sendStatus(res, 200, response);
            });
    }
}

/**
 * @route DELETE /products
 * @group Products
 * @param {string} products_id.query.required - Products Id
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.deleteProduct = (req, res) => {
    var response = {}
    var userId = req.userId
    var storeId = req.storeId
    var companyId = req.companyId
    if(storeId == 0){
        response = { success: false, message: 'You Not Affiliate In Any Store Or Company' }
        Utils.sendStatus(res, 200, response);
    }else{
        var dataSelect = {
            id: req.query.products_id,
            // company_id: companyId,
            store_id: storeId,
        }
        db('products')
            .where(dataSelect)
            .del();
        response = { success: true, message: 'Success Delete Products', data: rows }
        Utils.sendStatus(res, 200, response);
    }
}
/**
 * @route GET /bestselling
 * @group Products
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.bestSelling = (req, res) => {
    var storeId = req.storeId
    var response = { success: false, message: 'Failed Getting Data' }
    db('trxproducts')
        .columns([
            db.raw('products.id'),
            db.raw('products.name'),
            db.raw('products.desc'),
            db.raw('products.price'),
            db.raw('sum(trxproducts.qty) AS qty')
        ])
        .join('transaction', { 'trxproducts.transaction_id': 'transaction.id' })
        .join('products', { 'trxproducts.product_id': 'products.id' })
        .where({
            'transaction.store_id' : storeId
        })
        .groupBy('products.name')
        .then(rows => {
            response = { success: true, message: 'Success Getting Best Selling', data: rows }
        })
        .catch(error => {
            response = { success: false, message: 'Failed Getting Data', data: error }
        })
        .finally(() => {
            Utils.sendStatus(res, 200, response)
        })
}
