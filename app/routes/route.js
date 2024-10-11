'use strict';
var config = require('../../tools/config');
var multer  = require('multer');
var path = require('path');

var storageFiles = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, config.filePath)
        },
        filename: function (req, file, cb) {
            cb(null, Date.now()+'-'+file.originalname)
        }
    })

var uploadFiles = multer({ storage: storageFiles })
module.exports = function(app) {
    var general = require('../controllers/general.controller');
    var token = require('../controllers/token.controller');
    var tokenAdmin = require('../controllers/token-admin.controller');

    var account = require('../controllers/account.controller');
    var misc = require('../controllers/misc.controller');
    var payment = require('../controllers/payment.controller');
    var kios = require('../controllers/kios.controller')

    // var account = require('../controllers/account.controller');
    // var company = require('../controllers/company.controller');
    // var stores = require('../controllers/store.controller');
    // var employee = require('../controllers/employee.controller');
    // var product = require('../controllers/product.controller');
    // var material = require('../controllers/material.controller');
    // var recipe = require('../controllers/recipe.controller');
    // var transaction = require('../controllers/transaction.controller');
    // var suppliers = require('../controllers/suppliers.controller');
    // var revenue = require('../controllers/revenue.controller')
    // var verifyToken = require('../controllers/token.controller');
    // var kloter = require('../controllers/kloter.controller');
    // var voucher = require('../controllers/voucher.controller');
    // var sholat = require('../controllers/sholat.controller');
    // var withdraw = require('../controllers/withdraw.controller')
    // var operasional = require('../controllers/operasional.controller')
    // var category = require('../controllers/category.controller')
    // var qris = require('../controllers/qr.controller')

    app.route('/').post(general.index).get(general.index).put(general.index).delete(general.index);
    app.route('/register').post(account.register).get(general.index).put(general.index).delete(general.index);
    app.route('/login').post(account.login).get(general.index).put(general.index).delete(general.index);
    app.route('/me').post(general.index).get(token, account.getMe).put(general.index).delete(general.index);

    // 
    app.route('/utility').post(token, misc.addUtility).get(token, misc.getUtility).put(token, misc.updateUtility).delete(general.index);
    app.route('/config').post(token, misc.addConfig).get(token, misc.getConfig).put(token, misc.updateConfig).delete(general.index);
    app.route('/block').post(token, misc.addBlock).get(token, misc.getBlock).put(token, misc.updateBlock).delete(general.index);
    app.route('/tenant').post(token, misc.addTenant).get(token, misc.getTenant).put(token, misc.updateTenant).delete(general.index);

    app.route('/kios').post(token, kios.addKios).get(token, kios.dataKios).put(general.index).delete(general.index);
    app.route('/kios/utility').post(general.index).get(token, kios.utilitasKios).put(general.index).delete(general.index);

    app.route('/pay/retribution').post(token, payment.payRetribution).get(token, misc.getTenant).put(token, misc.updateTenant).delete(general.index);
}
