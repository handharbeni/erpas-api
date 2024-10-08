'use strict'
var config = require('../../tools/config');
var db = require('../../knex/knex');
var Utils = require('../utils/utils');

//http://www.json-generator.com/api/json/get/cqWuFIvHJu?indent=2


/**
 * @route POST /order
 * @group Order
 * @param {string} buyer.query.required - Buyer
 * @param {string} total_price.query.required - Total Price
 * @param {string} tax.query.required - Tax
 * @param {string} service.query.required - Service
 * @param {string} discount.query.required - discount
 * @param {string} transaction_id.query.required - Transaction Id Client
 * @param {string} list_item.query.required - List Item JSON Input sample on http://www.json-generator.com/api/json/get/bQdtgEZIJe?indent=2
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.createOrder = async (req, res) => {
    var userId = req.userId
    var storeId = 0
    storeId = req.storeId

    var trxBuyer = req.query.buyer
    var trxStoreId = storeId
    var trxTotalPrice = req.query.total_price
    var trxTax = req.query.tax
    var trxService = req.query.service
    var trxDiscount = req.query.discount
    var trxTransactionIDClient = req.query.transaction_id
    var trxListItem = JSON.parse(req.query.list_item)

    var response = { success:false, message:'Order Failed' }

    var getPOSMethod = await getMethod();
    var posMethod = getPOSMethod[0].value

    var posOrder = 'ASC'
    if(posMethod == 'LIFO'){
        posOrder = 'DESC'
    }

    if(storeId != 0 || storeId != null){
        var validatedItems = await validateItems(trxListItem);
        // if(validatedItems == true){
        if(true){
            var dataConditionStore = {
                id: storeId
            }
            var stores = getStores(dataConditionStore);
            stores.then(
                async (result) => {
                  // result[0].store_type == 1
                    if(true){
                        var dataInsertOrder = {
                            buyer: trxBuyer,
                            store_id: trxStoreId,
                            total_price: trxTotalPrice,
                            tax: trxTax,
                            service: trxService,
                            discount: trxDiscount,
                            transaction_id: trxTransactionIDClient,
                            trx_by: userId
                        }
                        var returningTransaction = await insertToTable('transaction', dataInsertOrder)

                        for(var item in trxListItem.items){
                            var items = JSON.parse(item)
                            var dataConditionProducts = {
                                id: trxListItem.items[items].product_id
                            }
                            var dataProducts = await getProducts(dataConditionProducts)
                            var dataInsertProduct = {
                                product_id: trxListItem.items[items].product_id,
                                qty: trxListItem.items[items].qty,
                                transaction_id: returningTransaction,
                                created_by: userId,
                                sell_price: trxListItem.items[items].sell_price,
                                buy_price: trxListItem.items[items].buy_price,
                                hpp: (parseInt(trxListItem.items[items].sell_price, 10) - parseInt(trxListItem.items[items].buy_price, 10))
                            }
                            var returningTrxProducts = await insertToTable('trxproducts', dataInsertProduct)
                            // TODO:  can be enable / disable
                            var dataConditionRecipe = {
                                product_id: trxListItem.items[items].product_id
                            }
                            var dataRecipe = await getRecipes(dataConditionRecipe)
                            for(var itemRecipes in dataRecipe){
                                var dataConditionTrxMaterials = {
                                    destination_id: storeId,
                                    material_id: dataRecipe[itemRecipes].material_id
                                }
                                var dataMaterials = await getTrxMaterials(dataConditionTrxMaterials, posOrder)

                                var dataInsertIngridients = {
                                    trx_product_id: returningTrxProducts[0],
                                    trx_material_id: dataMaterials[0].id,
                                    qty_ingridient: dataRecipe[itemRecipes].qty * trxListItem.items[items].qty,
                                    created_by: userId
                                }
                                var insertingridient = await insertToTable('trxingridient', dataInsertIngridients)
                            }
                        }
                        response = { success:true, message:'Transaction Success', data: returningTransaction[0] }
                    }else{
                        response = { success: false, message: 'Insufficient Privileges' }
                    }
                    Utils.sendStatus(res, 200, response)
                },
                error => {
                    response = { success: false, message: 'Failed To Getting Data' }
                    Utils.sendStatus(res, 200, response)
                }
            )
        }else{
            Utils.sendStatus(res, 200, { success: false, message:`Some Items Doesn't Have Ingridients` })
        }
    }else{
        Utils.sendStatus(res, 200, { success: false, message:`Some Items Doesn't Have Ingridients` })
    }
}

/**
 * @route POST /validateitem
 * @group Order
 * @param {string} product_id.query.required - Product Id
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.validateAddItems = async (req, res) => {
    var userId = req.userId
    var storeId = req.storeId
    var productId = req.query.product_id

    var validatedItem = await checkItem(productId);
    var response = { success: validatedItem, message: validatedItem }
    Utils.sendStatus(res, 200, response)
}

/**
 * @route GET /history
 * @group Order
 * @param {string} by_user.query.required - By User (true / false)
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.history = (req, res) => {
    var userId = req.userId
    var storeId = req.storeId
    var byUser = req.query.by_user // true / false

    var dataCondition = {
        store_id: storeId,
        is_deleted: false
    }

    if(byUser == true){
        dataCondition = {
            store_id: storeId,
            trx_by: userId,
            is_deleted: false
        }
    }

    var dataTransaction = getTransaction(dataCondition)
    dataTransaction.then(
        success => {
            var response = { success: true, message: 'Success Getting History', data: success }
            Utils.sendStatus(res, 200, response)
        },
        error => {
            var response = { success: false, message: 'Failed Getting History', data: error}
            Utils.sendStatus(res, 200, response)
        }
    )
}

/**
 * @route GET /invoice
 * @group Order
 * @param {string} transaction_id.query.required - Transaction Id
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */

exports.getInvoices = (req, res) => {
    var userId = req.userId
    var storeId = req.storeId
    var transactionId = req.query.transaction_id
    var response = { success: false, message: "Failed Getting Data" }
    var dataCondition = {
        id: transactionId,
        is_deleted: false
    }
    var invoices = fetchInvoices(dataCondition)
    invoices.then(
        success => {
            response = { success: true, message: "Success Getting Data", data: success }
            Utils.sendStatus(res, 200, response)
        },
        error => {
            Utils.sendStatus(res, 200, response)
        }
    )
}


/**
 * @route POST /invoice
 * @group Order
 * @param {string} transaction_id.query.required - Transaction Id
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.printInvoice = (req, res) => {
    var userId = req.userId
    var storeId = req.storeId
    var transactionId = req.query.transaction_id

    var dataCondition = {
        transaction_id: transactionId
    }

    var response = { success: false, message: 'Failed Fetching Data' }
    var dataTransaction = fetchDataInvoices(dataCondition)
    dataTransaction.then(
        success => {
            if(success.length > 0){
                var printCount = success[0].print_count + 1
                var tableName = 'invoices'
                var dataCondition = {
                    transaction_id: transactionId
                }
                var dataUpdate = {
                    print_count: printCount
                }
                var updateInvoice = updateToTable(tableName, dataCondition, dataUpdate)
                updateInvoice.then(
                    success => {
                        response = { success: true, message: 'Do Print', data: success }
                        Utils.sendStatus(res, 200, response)
                    },
                    error => {
                        Utils.sendStatus(res, 200, response)
                    }
                )
            }else{
                var dataInsert = {
                    transaction_id: transactionId,
                    created_by: userId,
                    print_count: 1
                }
                var insertInvoice = insertToTable('invoices', dataInsert)
                insertInvoice.then(
                    success => {
                        response = { success: true, message: 'Do Print', data: success }
                        Utils.sendStatus(res, 200, response)
                    },
                    error => {

                        Utils.sendStatus(res, 200, response)
                    }
                )
            }
        },
        error => {
            Utils.sendStatus(res, 200, response)
        }
    )
}

/**
 * @route GET /delete-transaction/{id}
 * @group Order
 * @param {string} id.path.required - Transaction Id
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.deleteTransaction = (req, res) => {
  var userId = req.userId
  var storeId = req.storeId
  var transactionId = req.params.id

  var dataCondition = {
      id: transactionId,
      store_id: storeId
  }
  var dataUpdate = {
      is_deleted: true,
      deleted_by: userId
  }

  var response = { success: false, message: 'Failed Deleting Transaction Data' }
  updateToTable('transaction', dataCondition, dataUpdate).then(
    (success) => {
      response = { success: true, message: "Success Delete Transaction Data", data: success }
      Utils.sendStatus(res, 200, response)
    },
    (error) => {
      response.error = error
      Utils.sendStatus(res, 200, response)
    }
  )
}

function getStores(condition){
    return new Promise( async (resolve, reject) => {
        await db('stores')
            .where(condition)
            .then(rows => {
                resolve(rows)
            })
            .catch(error => {
                reject(error)
            });
    });
}

function getMethod(){
    return new Promise((resolve, reject) => {
        db('tools')
            .where({
                name: 'POS_METHOD'
            })
            .then(rows => {
                resolve(rows)
            })
            .catch(error => {
                reject(error)
            });
    });
}

function getProducts(condition){
    return new Promise((resolve, reject) => {
        db('products')
            .where(condition)
            .then(rows => {
                resolve(rows)
            })
            .catch(error => {
                reject(error)
            });
    });
}

function getRecipes(condition){
    return new Promise((resolve, reject) => {
        db('recipes')
            .where(condition)
            .then(rows => {
                resolve(rows)
            })
            .catch(error => {
                reject(error)
            });
    });
}

function getTrxMaterials(condition, order){
    return new Promise((resolve, reject) => {
        db('trxmaterials')
            .where(condition)
            .orderBy('id', order)
            .limit(1)
            .then(rows => {
                resolve(rows)
            })
            .catch(error => {
                reject(error)
            });
    });
}


function getTrxProducts(condition){
    return new Promise((resolve, reject) => {
        db('trxproducts')
            .where(condition)
            .then(rows => {
                resolve(rows)
            })
            .catch(error => {
                reject(error)
            });
    });
}
function getTransaction(condition){
    return new Promise((resolve, reject) => {
        db('transaction')
            .where(condition)
            .then(rows => {
                resolve(rows)
            })
            .catch(error => {
                reject(error)
            });
    });
}
function fetchDataInvoices(condition){
    return new Promise((resolve, reject) => {
        db('invoices')
            .where(condition)
            .then(rows => {
                resolve(rows)
            })
            .catch(error => {
                reject(error)
            });
    });
}

function insertToTable(tableName, dataInsert){
    return new Promise((resolve, reject) => {
        db(tableName)
            .insert(dataInsert)
            .returning('id')
            .then(rows => {
                resolve(rows)
            })
            .catch(error => {
                reject(error)
            });
    });
}

function fetchInvoices(dataCondition){
    return new Promise((resolve, reject) => {
        db('transaction')
            .where(dataCondition)
            .then(async (rows) => {
                if(rows.length > 0){
                    var transactionId = rows[0].id
                    var dataCondition = {
                        transaction_id: transactionId
                    }
                    var detailProduct = await getTrxProducts(dataCondition)
                    var dataCallback = {
                        info : rows[0],
                        items : detailProduct
                    }
                    resolve(dataCallback)
                }else{
                    reject(null)
                }
            })
            .catch(error => {
                reject(error)
            })
    })
}

function updateToTable(tableName, dataCondition, dataUpdate){
    return new Promise((resolve, reject) => {
        db(tableName)
            .where(dataCondition)
            .update(dataUpdate)
            .then(rows => {
                resolve(rows)
            })
            .catch(error => {
                reject(error)
            })
    })
}

function deleteFromTable(tableName, dataDelete){
    return new Promise((resolve, reject)=>{
        db(tableName)
            .where(dataDelete)
            .del();
        resolve(true);
    });
}


function validateItems(listItems){
    return new Promise((resolve, reject) => {
        var arrayItems = [];
        for(var item in listItems.items){
            var items = JSON.parse(item)
            arrayItems.push(listItems.items[items].product_id)
        }
        db('recipes')
            .whereIn('product_id', arrayItems)
            .then(rows => {
                if(rows.length >= arrayItems.length){
                    resolve(true)
                }else{
                    resolve(false)
                }
            })
            .catch(error => {
                reject(error)
            })
    });
}
function checkItem(item){
    return new Promise((resolve, reject) => {
        var arrayItems = []
        arrayItems.push(item)
        db('recipes')
            .whereIn('product_id', arrayItems)
            .then(rows => {
                if(rows.length > 0){
                    resolve(true)
                }else{
                    resolve(false)
                }
            })
            .catch(error => {
                resolve(false)
            })
    });
}

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwic3RvcmVfaWQiOiIyIiwiY29tcGFueV9pZCI6MCwiaWF0IjoxNTcwMDA3NjE2LCJleHAiOjE1NzA2MTI0MTZ9.SNhlr0QH2hbVtdekqv1Y5pWEM6okwWdm66zWKvGQp8w
