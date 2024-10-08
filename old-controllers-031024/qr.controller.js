'use strict'
var config = require('../../tools/config');
var db = require('../../knex/knex');
var Utils = require('../utils/utils');

const request = require('request');
const moment = require('moment');
const sha256 = require('js-sha256');


/**
 * @route POST /jatimQris
 * @group QRIS
 * @param {string} id.query.required - Terminal Id
 * @param {string} bill_number.query.required - Bill Number
 * @param {string} amount.query.required - Amount
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 */

exports.requestJatimQr = (req, res) => {
    var response = {}
    var userId = req.userId
    var billNumber = req.query.bill_number;
    var terminalId = req.query.id;
    var amount = req.query.amount;

    var reqUrl = "https://jatimva.bankjatim.co.id/MC/Qris/Dynamic"
    var merchantPan = "9360011400000557635"
    var hashCode = "SSS2SV5LHK"

    var purposeTrx = "Pengujian";
    var storeLabel = "POS";
    var customerLabel = "POS";
    var expired = moment().add(7, 'days').calendar(null, {
        sameElse: 'Y-MM-D HH:mm:ss'
    });
    
    var concat = merchantPan.concat(billNumber, terminalId, hashCode);
    var hashCodeKey = sha256(concat);
    Utils.getConfigs('JATIM_').then(
        (success) => {
            reqUrl = success.JATIM_QRIS_URL
            merchantPan = success.JATIM_QRIS_MERCHANTPAN
            hashCode = success.JATIM_QRIS_HASHCODE
            purposeTrx = success.JATIM_QRIS_PURPOSETRX
            storeLabel = success.JATIM_QRIS_STORELABEL
            customerLabel = success.JATIM_QRIS_CUSTOMERLABEL

            var arrData = {
                "merchantPan": merchantPan,
                "hashcodeKey": hashCodeKey,
                "billNumber": billNumber,
                "purposetrx": purposeTrx,
                "Storelabel": storeLabel,
                "Customerlabel": customerLabel,
                "terminalUser": terminalId,
                "expiredDate": expired,
                "amount": amount
            };

            request()
            var jsonData = JSON.stringify(arrData);
            response = { success: false, message: 'Success generate QRIS', data: jsonData }
            Utils.sendStatus(res, 200, response)
        },
        (error) => {
            response = { success: false, message: 'Failed To get QRIS', data: error }
            Utils.sendStatus(res, 200, response)
        }
    );
    // Utils.sendStatus(res, 200, {success: true, message: toolResult});
}
