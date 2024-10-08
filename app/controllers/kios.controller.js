'use strict'
var jwt = require('jsonwebtoken');
var config = require('../../tools/config');
var db = require('../../knex/knex');
var Utils = require('../utils/utils');
var bcrypt = require('bcryptjs');

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

exports.dataKios = (req, res) => {
    var response = {}
    var userId = req.userId

    db('store')
        .then(async (rowStore => {
            if(rowStore.length > 0){
                response = { success: true, message: 'Detail Found', data: rowStore }
            } else {
                response = { success: false, message:'Data Not Found' }
            }
        }))
        .catch(error => {
            response = { success: false, message: 'Cannot Getting Data Kios / Store', data: error }
        })
        .finally(() => {
            Utils.sendStatus(res, 200, response)
        });
}

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
        .then(async (row) => {
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