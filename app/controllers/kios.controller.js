'use strict'
var jwt = require('jsonwebtoken');
var config = require('../../tools/config');
var db = require('../../knex/knex');
var Utils = require('../utils/utils');
var bcrypt = require('bcryptjs');

/**
 * @route POST /kios
 * @group Kios
 * @param {string} config_id.query.required - Configuration Id
 * @param {string} block_id.query.required - Block Id
 * @param {string} store_number.query.required - Store Number
 * @param {string} price_rent.query.required - Price Rent
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.addKios = (req, res) => {
    var response = {};
    var userId = req.userId

    var configId = req.query.config_id
    var blockId = req.query.block_id
    var storeNumber = req.query.store_number
    var priceRent = req.query.price_rent

    var dataSelect = {
        id: userId
    }
    var dataInsertKios = {
        user_id: userId,
        config_id: configId,
        block_id: blockId,
        store_number: storeNumber,
        price_rent: priceRent
    }

    db('store')
        .insert(dataInsertKios)
        .returning('id')
        .then((rows) => {
            response = { success: true, message: 'Success Add Kios / Store', data: rows }
        })
        .catch(error => {
            response = { success: false, message: 'Error Add Kios / Store', data: error }
        })
        .finally(() => {
            Utils.sendStatus(res, 200, response);
        });
}


/**
 * @route GET /kios
 * @group Kios
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.dataKios = (req, res) => {
    var response = {}
    var userId = req.userId

    db('store')
        .then(async (rowStore) => {
            if(rowStore.length > 0){
                response = { success: true, message: 'Detail Found', data: rowStore }
            } else {
                response = { success: false, message:'Data Not Found' }
            }
        })
        .catch(error => {
            response = { success: false, message: 'Cannot Getting Data Kios / Store', data: error }
        })
        .finally(() => {
            Utils.sendStatus(res, 200, response)
        });
}

/**
 * @route GET /kios/utility
 * @group Kios Utility
 * @param {string} kios_id.query.required - Kios ID
 * @param {string} utility_id.query.required - Utility ID
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.utilitasKios = (req, res) => {
    var response = {}
    var userId = req.userId
    var kiosId = req.query.kios_id
    var utilityId = req.query.utility_id

    var dataSelect = {
        store_id: kiosId,
        utility_id: utilityId
    }

    db('store_utility')
        .where(dataSelect)
        .then(async (rowStore) => {
            if(rowStore.length > 0){
                response = { success: true, message: 'Utility Found', data: rowStore }
            } else {
                response = { success: false, message:'Data Not Found' }
            }
        })
        .catch(error => {
            response = { success: false, message: 'Cannot Getting Data Kios / Store', data: error }
        })
        .finally(() => {
            Utils.sendStatus(res, 200, response)
        });
}


/**
 * @route POST /kios/utility
 * @group Kios Utility
 * @param {string} kios_id.query.required - Kios ID
 * @param {string} utility_id.query.required - Utility ID
 * @param {string} value.query.required - Value
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.addKiosUtility = (req, res) => {
    var response = {}
    var userId = req.userId
    var kiosId = req.query.kios_id
    var utilityId = req.query.utility_id
    var value = req.query.value

    var dataInsert = {
        user_id: userId,
        store_id: kiosId,
        utility_id: utilityId,
        value: value
    }

    var dataSelect = {
        store_id: kiosId,
        utility_id: utilityId
    }

    db('store_utility')
        .where(dataSelect)
        .then(async (rowStore) => {
            if(rowStore.length > 0){
                response = { success: true, message: 'Utility Found', data: rowStore }
            } else {
                await db('store_utility')
                    .insert(dataInsert)
                    .returning('id')
                    .then( id => {
                        response = { success: true, message:'Success Setup Store Utility / Store' }
                    })
                    .catch(error => {
                        response = { success: false, message: 'Error Setup Utility', data: error }
                    })
                    .finally(() => {
                        return response
                    })
            }
        })
        .catch(error => {
            response = { success: false, message: 'Cannot Getting Data Kios / Store', data: error }
        })
        .finally(() => {
            Utils.sendStatus(res, 200, response)
        });
}


/**
 * @route PUT /kios/utility
 * @group Kios Utility
 * @param {string} kios_id.query.required - Kios ID
 * @param {string} utility_id.query.required - Utility ID
 * @param {string} value.query.required - Value
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.updateKiosUtility = (req, res) => {
    var response = {}
    var userId = req.userId
    var kiosId = req.query.kios_id
    var utilityId = req.query.utility_id
    var value = req.query.value

    var dataUpdate = {
        user_id: userId,
        store_id: kiosId,
        utility_id: utilityId,
        value: value
    }

    var dataSelect = {
        store_id: kiosId,
        utility_id: utilityId
    }

    db('store_utility')
        .where(dataSelect)
        .update(dataUpdate)
        .then( id => {
            response = { success: true, message:'Success Update Store Utility / Store', data:id }
        })
        .catch(error => {
            response = { success: false, message: 'Error Update Utility', data: error }
        })
        .finally(() => {
            Utils.sendStatus(res, 200, response)
        });
}


/**
 * @route POST /kios/sewa
 * @group Kios
 * @param {string} store_id.query.required - Store ID
 * @param {string} store_number.query.required - Store Number
 * @param {string} tenant_name.query.required - Tenant Name
 * @param {string} tenant_address.query.required - Tenant Address
 * @param {string} start.query.required - Start
 * @param {string} end.query.required - End
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.sewaKios = (req, res) => {
    var response = {};
    var userId = req.userId

    var storeId = req.query.store_id
    var storeNumber = req.query.store_number
    var tenantName = req.query.tenant_name
    var tenantAddress = req.query.tenant_address
    var start = req.query.start
    var end = req.query.end

    var dataSelectTenant = {
        name: tenantName,
        address: tenantAddress
    }

    var dataInsertTenant = {
        user_id: userId,
        name: tenantName,
        address: tenantAddress
    }

    var dataSelectKios = {
        id: userId
    }
    var dataInsertKios = {
        store_id: storeId,
        user_id: userId,
        start: start,
        end: end
    }

    db('tenant_data')
        .where(dataSelectTenant)
        .then(async (result) => {
            if (result.length > 0) {
                var tenantId = result[0].id
                dataInsertKios['tenant_id'] = tenantId
                await db('store_transaction')
                    .insert(dataInsertKios)
                    .returning('id')
                    .then(id => {
                        response = { success: true, message: 'Rent Success, Please go to payment / Generate Billing', data: id }
                    })
                    .catch(error => {
                        response = { success: false, message: 'Rent Error', data: error }
                    })
            } else {
                await db('tenant_data')
                    .insert(dataInsertTenant)
                    .returning('id')
                    .then(async (id) => {
                        var tenantId = id[0].id
                        dataInsertKios['tenant_id'] = tenantId
                        console.log(dataInsertKios)
                        await db('store_transaction')
                            .insert(dataInsertKios)
                            .returning('id')
                            .then(id => {
                                response = { success: true, message: 'Rent Success, Please go to payment / Generate Billing', data: id }
                            })
                            .catch(error => {
                                console.log(error)
                                response = { success: false, message: 'Rent Error', data: error }
                            })    
                    })
                    .catch(error => {
                        response = { success: false, message: 'Error Adding Tenant', data: error }
                    })

            }
        })
        .catch(error => {
            console.log(error)
            response = { success: false, message: 'Error Add Tenant', data: error }
        })
        .finally(() => {
            Utils.sendStatus(res, 200, response);
        })
}