'use strict'
var jwt = require('jsonwebtoken');
var config = require('../../tools/config');
var db = require('../../knex/knex');
var Utils = require('../utils/utils');
var bcrypt = require('bcryptjs');
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzI4NDA3NzI1LCJleHAiOjE3Mjg0OTQxMjV9.xf3fTR4dgjCaFt1IC0KKWbN80Kr7b2AgKixofG2ub9c

/**
 * @route POST /utility
 * @group Utility
 * @param {string} value.query.required - Value
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.addUtility = (req, res) => {
    var response = {};
    var userId = req.userId

    var value = req.query.value

    var dataInsert = {
        user_id: userId,
        value: value
    }

    db('utility_store')
        .insert(dataInsert)
        .returning('id')
        .then((rows) => {
            response = { success: true, message: 'Add Success', data: rows }
        })
        .catch(error => {
            response = { success: false, message: 'Error on create', data: error }
        })
        .finally(() => {
            Utils.sendStatus(res, 200, response);
        });
}

/**
 * @route PUT /utility
 * @group Utility
 * @param {string} utility_id.query.required - Utility Id
 * @param {string} value.query.required - Value
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.updateUtility = (req, res) => {
    var response = {};
    var userId = req.userId

    var utilityId = req.query.utility_id
    var value = req.query.value

    var dataSelect = {
        user_id: userId,
        utility_id: utilityId
    }

    var dataUpdate = {
        value: value
    }

    db('utility_store')
        .where(dataSelect)
        .update(dataUpdate)
        .returning('id')
        .then(rows => {
            response = { success: true, message: 'Update Success', data: rows }
        })
        .catch(error => {
            response = { success: false, message: 'Update Failed', data: error }
        })
        .finally(() => {
            Utils.sendStatus(res, 200, response);
        });
}

/**
 * @route GET /utility
 * @group Utility
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.getUtility = (req, res) => {
    var response = {};
    var userId = req.userId

    db('utility_store')
        .then(rows => {
            response = { success: true, message: 'Get Success', data: rows }
        })
        .catch(error => {
            response = { success: false, message: 'Update Failed', data: error }
        })
        .finally(() => {
            Utils.sendStatus(res, 200, response);
        });
}


/**
 * @route POST /config
 * @group Configuration
 * @param {string} key.query.required - Key
 * @param {string} value.query.required - Value
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.addConfig = (req, res) => {
    var response = {};
    var userId = req.userId

    var keyQuery = req.query.key
    var valueQuery = req.query.value

    var dataInsert = {
        user_id: userId,
        key: keyQuery,
        value: valueQuery
    }

    db('config')
        .insert(dataInsert)
        .returning('id')
        .then((rows) => {
            response = { success: true, message: 'Add Success', data: rows }
        })
        .catch(error => {
            response = { success: false, message: 'Error on create', data: error }
        })
        .finally(() => {
            Utils.sendStatus(res, 200, response);
        });
}

/**
 * @route PUT /config
 * @group Configuration
 * @param {string} config_id.query.required - Config Id
 * @param {string} key.query.required - Key
 * @param {string} value.query.required - Value
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.updateConfig = (req, res) => {
    var response = {};
    var userId = req.userId

    var configId = req.query.config_id
    var keyQuery = req.query.key
    var valueQuery = req.query.value

    var dataSelect = {
        user_id: userId,
        id: configId
    }

    var dataUpdate = {
        key: keyQuery,
        value: valueQuery
    }

    db('config')
        .where(dataSelect)
        .update(dataUpdate)
        .returning('id')
        .then(rows => {
            response = { success: true, message: 'Update Success', data: rows }
        })
        .catch(error => {
            response = { success: false, message: 'Update Failed', data: error }
        })
        .finally(() => {
            Utils.sendStatus(res, 200, response);
        });
}

/**
 * @route GET /config
 * @group Configuration
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.getConfig = (req, res) => {
    var response = {};
    var userId = req.userId

    db('config')
        .then(rows => {
            response = { success: true, message: 'Get Success', data: rows }
        })
        .catch(error => {
            response = { success: false, message: 'Update Failed', data: error }
        })
        .finally(() => {
            Utils.sendStatus(res, 200, response);
        });
}



/**
 * @route POST /block
 * @group Block
 * @param {string} block.query.required - Block
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.addBlock = (req, res) => {
    var response = {};
    var userId = req.userId

    var blockQuery = req.query.block

    var dataInsert = {
        user_id: userId,
        block: blockQuery
    }

    db('block_store')
        .insert(dataInsert)
        .returning('id')
        .then((rows) => {
            response = { success: true, message: 'Add Success', data: rows }
        })
        .catch(error => {
            response = { success: false, message: 'Error on create', data: error }
        })
        .finally(() => {
            Utils.sendStatus(res, 200, response);
        });
}

/**
 * @route PUT /block
 * @group Block
 * @param {string} block_id.query.required - Block Id
 * @param {string} block.query.required - Block
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.updateBlock = (req, res) => {
    var response = {};
    var userId = req.userId

    var blockId = req.query.block_id
    var blockQuery = req.query.block

    var dataSelect = {
        user_id: userId,
        id: blockId
    }

    var dataUpdate = {
        block: blockQuery
    }

    db('block_store')
        .where(dataSelect)
        .update(dataUpdate)
        .returning('id')
        .then(rows => {
            response = { success: true, message: 'Update Success', data: rows }
        })
        .catch(error => {
            response = { success: false, message: 'Update Failed', data: error }
        })
        .finally(() => {
            Utils.sendStatus(res, 200, response);
        });
}

/**
 * @route GET /block
 * @group Block
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.getBlock = (req, res) => {
    var response = {};
    var userId = req.userId

    db('block_store')
        .then(rows => {
            response = { success: true, message: 'Get Success', data: rows }
        })
        .catch(error => {
            response = { success: false, message: 'Update Failed', data: error }
        })
        .finally(() => {
            Utils.sendStatus(res, 200, response);
        });
}



/**
 * @route POST /tenant
 * @group Tenant
 * @param {string} name.query.required - Name
 * @param {string} address.query.required - Address
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.addTenant = (req, res) => {
    var response = {};
    var userId = req.userId

    var nameQuery = req.query.name
    var addressQuery = req.query.address

    var dataInsert = {
        user_id: userId,
        name: nameQuery,
        address: addressQuery
    }

    db('tenant_data')
        .insert(dataInsert)
        .returning('id')
        .then((rows) => {
            response = { success: true, message: 'Add Success', data: rows }
        })
        .catch(error => {
            response = { success: false, message: 'Error on create', data: error }
        })
        .finally(() => {
            Utils.sendStatus(res, 200, response);
        });
}

/**
 * @route PUT /tenant
 * @group Tenant
 * @param {string} tenant_id.query.required - Tenant id
 * @param {string} name.query.required - Name
 * @param {string} address.query.required - Address
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.updateTenant = (req, res) => {
    var response = {};
    var userId = req.userId

    var tenantId = req.query.tenant_id
    var nameQuery = req.query.name
    var addressQuery = req.query.address

    var dataSelect = {
        user_id: userId,
        id: tenantId
    }

    var dataUpdate = {
        name: nameQuery,
        address: addressQuery
    }

    db('tenant_data')
        .where(dataSelect)
        .update(dataUpdate)
        .returning('id')
        .then(rows => {
            response = { success: true, message: 'Update Success', data: rows }
        })
        .catch(error => {
            response = { success: false, message: 'Update Failed', data: error }
        })
        .finally(() => {
            Utils.sendStatus(res, 200, response);
        });
}


/**
 * @route GET /tenant
 * @group Tenant
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.getTenant = (req, res) => {
    var response = {};
    var userId = req.userId

    db('tenant_data')
        .then(rows => {
            response = { success: true, message: 'Get Success', data: rows }
        })
        .catch(error => {
            response = { success: false, message: 'Update Failed', data: error }
        })
        .finally(() => {
            Utils.sendStatus(res, 200, response);
        });
}