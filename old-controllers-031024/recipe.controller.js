'use strict'
var jwt = require('jsonwebtoken');
var config = require('../../tools/config');
var db = require('../../knex/knex');
var Utils = require('../utils/utils');
var bcrypt = require('bcryptjs');
/**
 * @route GET /recipe
 * @group Recipe
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @param {string} product_id.query.required - Product Id
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.getRecipe = (req, res) => {
    var storeId = req.storeId
    var userId = req.userId

    var response = { success: false, message: 'Failed Getting Data' }

    var dataConditionRecipe = {
        'products.id': req.query.product_id,
        // 'employee.store_id': storeId,
        // 'employee.user_id': userId
    }
    if(storeId != 0){
        db.from('recipes')
            .select('recipes.*', 'products.*', 'materials.*', 'recipes.id as id')
            .join('products', {'products.id': 'recipes.product_id'})
            .join('materials', {'materials.id': 'recipes.material_id'})
            // .join('stores', {'stores.id': 'products.store_id'})
            // .join('employee', {'employee.store_id': 'stores.id'})
            .where(dataConditionRecipe)
            .then(rows => {
                response = { success: true, message:'Success Getting Data', data: rows }
            })
            .catch(error => {
                response = { success: false, message:'Failed Getting Data', data: error }
            })
            .finally(() => {
                Utils.sendStatus(res, 200, response);
            });
    }else{
        response = { success: false, message: 'Invalid Token' }
        Utils.sendStatus(res, 200, response);
    }
}


/**
 * @route POST /recipe
 * @group Recipe
 * @param {integer} product_id.query.required - Product Id
 * @param {integer} material_id.query.required - Material Id
 * @param {integer} qty.query.required - Quantity
 * @param {string} uom.query.required - UOM
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.addRecipe = (req, res) => {
    var storeId = req.storeId
    var userId = req.userId
    var productId = req.query.product_id
    var materialId = req.query.material_id
    var qty = req.query.qty
    var uom = req.query.uom

    var response = { success: false, message: 'Failed Getting Data' }

    if(storeId != 0){
        var dataConditionProducts = {
            'store_id': storeId,
            'products.id': productId
        }
        var dataConditionMaterials = {
            'store_id': storeId,
            'materials.id': materialId
        }
        db('products')
            .join('stores', {'stores.id': 'products.store_id'})
            .where(dataConditionProducts)
            .then(async (rows) => {
                if(rows.length > 0){
                    await db('materials')
                            .join('stores', {'stores.id': 'materials.store_id'})
                            .where(dataConditionMaterials)
                            .then(async (rowsMaterial) => {
                                if(rowsMaterial.length > 0){
                                    var dataInsert = {
                                        product_id: productId,
                                        material_id: materialId,
                                        qty: qty,
                                        uom: uom,
                                        created_by: userId
                                    }
                                    await db('recipes')
                                            .insert(dataInsert)
                                            .returning('id')
                                            .then(resultInsert => {
                                                response = { success: true, message: 'Success Add Recipes', data: resultInsert }
                                            })
                                            .catch(error => {
                                                response = { success: false, message: 'Failed To Getting Data', data:error }
                                            });
                                }else{
                                    response = { success: false, message: 'Insufficient Privileges On Materials' }
                                }
                            })
                            .catch(error => {
                                response = { success: false, message: 'Failed To Getting Data', data:error }
                            });
                }else{
                    response = { success: false, message: 'Insufficient Privileges On Products' }
                }
            })
            .catch(error => {
                response = { success: false, message: 'Failed To Getting Data', data:error }
            })
            .finally(() => {
                Utils.sendStatus(res, 200, response);
            });
    }else{
        response = { success: false, message: 'Invalid Token' }
        Utils.sendStatus(res, 200, response);
    }
}


/**
 * @route DELETE /recipe
 * @group Recipe
 * @param {integer} recipe_id.query.required - recipe_id
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.deleteRecipe = (req, res) => {
    var storeId = req.storeId
    var userId = req.userId
    var recipeId = req.query.recipe_id

    var response = { success: false, message: 'Failed Getting Data' }

    if(storeId != 0){
        var dataCondition  = {
            'recipes.id': recipeId
        }
        db('recipes')
            .join('products', {'products.id': 'recipes.product_id'})
            .join('materials', {'materials.id': 'recipes.material_id'})
            .join('stores', {'stores.id': "products.store_id", 'stores.id': 'materials.store_id'})
            .where(dataCondition)
            .then(async (rows) => {
                // response = { data:rows }
                if(rows.length > 0){
                    await db('recipes')
                            .where(dataCondition)
                            .del();
                    response = { success: true, message:'Success Delete Recipe' }
                }else{
                    response = { success: false, message: 'Insufficient Privileges On Recipes' }
                }
            })
            .catch(error => {
                response = { success: false, message: 'Failed To Getting Data', data:error }
            })
            .finally(() => {
                Utils.sendStatus(res, 200, response);
            });
            // Utils.sendStatus(res, 200, response);
    }else{
        response = { success: false, message: 'Invalid Token' }
        Utils.sendStatus(res, 200, response);
    }
}