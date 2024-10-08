'use strict'
var config = require('../../tools/config');
var db = require('../../knex/knex');
var Utils = require('../utils/utils');


/**
 * @route GET /materials
 * @group Materials
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.getMaterial = (req, res) => {
    var response = {}
    var userId = req.userId
    var storeId = req.storeId
    var companyId = req.companyId
    if(storeId == 0){
        response = { success: false, message: 'You Not Affiliate In Any Store' }
        Utils.sendStatus(res, 200, response);
    }else{
        var dataSelectStore = {
            id: storeId
        }
        var dataSelect = {
            'materials.store_id': storeId
        }
        db('stores')
            .where(dataSelectStore)
            .then(async (rowsStore)=>{
                if(rowsStore.length > 0){
                    var dataSelectDestination = {
                        'trxmaterials.destination_id': storeId,
                        'trxmaterials.is_received': true,
                        // 'transaction.is_deleted': false
                        // 'store_id': storeId
                    }
                    var dataSelectOrigin = {
                        'trxmaterials.origin_id': storeId,
                        'trxmaterials.is_received': true,
                        // 'transaction.is_deleted': false
                        // 'store_id': storeId
                    }


                    await db
                        .select(
                            'materials.id AS mat_id',
                            'trxmaterials.id AS astrxmaterial_id',
                            'trxmaterials.*',
                            'materials.*',
                            'trxingridient.*'
                        )
                        .from('materials')
                        .leftJoin('trxmaterials', { 'materials.id': 'trxmaterials.material_id' })
                        .leftJoin('trxingridient', { 'trxingridient.trx_material_id': 'trxmaterials.id' })
                        .leftJoin('trxproducts', {'trxproducts.id': 'trxingridient.trx_product_id'})
                        .leftJoin('transaction', {'transaction.id': 'trxproducts.transaction_id'})
                        .where(function () {
                            this
                                // .where(dataSelect)
                                .where(dataSelectOrigin)
                                .orWhere(dataSelectDestination)

                        })
                        // .where(dataSelectOrigin)
                        // .orWhere(dataSelectDestination)
                        .orderBy('mat_id')
                        .then(rowsBranch => {
                            var item = []
                            var total = []
                            var trxmaterial_id = 0;
                            // console.log(`rowsBranch Length ${rowsBranch.length}`)
                            for(var i = 0;i<rowsBranch.length;i++){
                                var jsonRows = {}
                                // total[rowsBranch[i].material_id] = 0;

                                jsonRows['material_id'] = rowsBranch[i].mat_id
                                jsonRows['name'] = rowsBranch[i].name
                                jsonRows['uom'] = rowsBranch[i].uom
                                if(rowsBranch[i].astrxmaterial_id == null){
                                    total[rowsBranch[i].material_id] = 0;
                                }else if(trxmaterial_id == rowsBranch[i].astrxmaterial_id){
                                    total[rowsBranch[i].material_id] = total[rowsBranch[i].material_id] - (rowsBranch[i].qty_ingridient==null?0:rowsBranch[i].qty_ingridient)
                                }else if(trxmaterial_id != rowsBranch[i].astrxmaterial_id){
                                    if(rowsBranch[i].destination_id == storeId){
                                        if(total[rowsBranch[i].material_id] != null){
                                            total[rowsBranch[i].material_id] +=  rowsBranch[i].qty - (rowsBranch[i].qty_ingridient==null?0:rowsBranch[i].qty_ingridient)
                                        }else{
                                            total[rowsBranch[i].material_id] = rowsBranch[i].qty - (rowsBranch[i].qty_ingridient==null?0:rowsBranch[i].qty_ingridient)
                                        }
                                    }else if(rowsBranch[i].origin_id == storeId){
                                        if(total[rowsBranch[i].material_id] != null){
                                            total[rowsBranch[i].material_id] -= rowsBranch[i].qty - (rowsBranch[i].qty_ingridient==null?0:rowsBranch[i].qty_ingridient)
                                        }else{
                                            total[rowsBranch[i].material_id] = rowsBranch[i].qty - (rowsBranch[i].qty_ingridient==null?0:rowsBranch[i].qty_ingridient)
                                        }
                                    }
                                }
                                jsonRows['qty'] = total[rowsBranch[i].material_id]
                                trxmaterial_id = rowsBranch[i].astrxmaterial_id
                                item[rowsBranch[i].mat_id] = jsonRows
                            }
                            var filtered = item.filter(function (el) {
                                return el != null;
                            });
                            response = { success: true, message: 'Success Get Materials', data: filtered }
                        })
                        .catch(error => {
                            response = { success: false, message: 'Cannot Getting Data Materials', data: error }
                        })
                }else{
                    response = { success: false, message: 'Store not found' }
                }
            })
            .catch(error => {
                response = { success: false, message: 'Cannot Getting Data Materials', data: error }
            })
            .finally(() => {
                Utils.sendStatus(res, 200, response)
            });
    }

}
/**
 * @route POST /materials
 * @group Materials
 * @param {string} name.query.required - Name
 * @param {string} sku.query.required - SKU
 * @param {string} uom.query.required - UOM
 * @param {string} supplier_id.query.required - Supplier Id
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.postMaterial = (req, res) => {
    var response = {}
    var userId = req.userId
    var storeId = req.storeId
    var companyId = req.companyId
    if(storeId == 0){
        response = { success: false, message: 'You Not Affiliate In Any Store' }
        Utils.sendStatus(res, 200, response);
    }else{
        var dataInsert = {
            name: req.query.name,
            sku: req.query.sku,
            uom: req.query.uom,
            supplier_id: req.query.supplier_id,
            store_id: storeId,
        }
        db('materials')
            .insert(dataInsert)
            .returning('id')
            .then((rows) => {
                initTrxMaterial(rows, storeId)
                response = { success: true, message: 'Success Insert Materials', data: rows }
            })
            .catch(error => {
                response = { success: false, message: 'Error Insert Materials', data: error }
            })
            .finally(() => {
                Utils.sendStatus(res, 200, response);
            });
    }
}

/**
 * @route PUT /materials
 * @group Materials
 * @param {string} name.query.required - Name
 * @param {string} sku.query.required - SKU
 * @param {string} uom.query.required - UOM
 * @param {string} materials_id.query.required - Materials Id
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.putMaterial = (req, res) => {
    var response = {}
    var userId = req.userId
    var storeId = req.storeId
    var companyId = req.companyId
    if(storeId == 0){
        response = { success: false, message: 'You Not Affiliate In Any Store' }
        Utils.sendStatus(res, 200, response);
    }else{
        var dataSelect = {
            id: req.query.materials_id,
            store_id: storeId,
        }
        var dataUpdate = {
            name: req.query.name,
            sku: req.query.sku,
            uom: req.query.uom
        }
        db('materials')
            .where(dataSelect)
            .update(dataUpdate)
            .returning('id')
            .then(rows => {
                response = { success: true, message: 'Success Update Materials', data: rows }
            })
            .catch(error => {
                response = { success: false, message: 'Error Update Materials', data: error }
            })
            .finally(() => {
                Utils.sendStatus(res, 200, response);
            });
    }
}

/**
 * @route DELETE /materials
 * @group Materials
 * @param {string} materials_id.query.required - Materials Id
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.deleteMaterial = (req, res) => {
    var response = {}
    var userId = req.userId
    var storeId = req.storeId
    var companyId = req.companyId
    if(storeId == 0){
        response = { success: false, message: 'You Not Affiliate In Any Store' }
        Utils.sendStatus(res, 200, response);
    }else{
        var dataSelect = {
            id: req.query.materials_id,
            store_id: storeId,
        }
        db('materials')
            .where(dataSelect)
            .del();
        response = { success: true, message: 'Success Delete Materials', data: rows }
        Utils.sendStatus(res, 200, response);
    }
}

/**
 * @route POST /buymaterialfromsupplier
 * @group Materials
 * @param {string} materials_id.query.required - Materials Id
 * @param {string} buy_price.query.required - Buy Price
 * @param {string} supplier_id.query.required - Supplier Id
 * @param {string} uom.query.required - Unit Of Measurement
 * @param {string} qty.query.required - Quantity
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.buyMaterialFromSupplier = (req, res) => {
    var response = { success: false, message: 'Insufficient Privileges' }
    var userId = req.userId
    var storeId = req.storeId

    var material_id = req.query.materials_id
    var buy_price = req.query.buy_price
    var origin_id = req.query.supplier_id
    var destination_id = storeId
    var supplier_id = req.query.supplier_id
    var created_by = userId
    var uom = req.query.uom
    var qty = req.query.qty
    var dataConditionMaterials = {
        'materials.id': material_id
    }
    if(storeId != 0){
        db('materials')
        .join('stores', { 'stores.id': 'materials.store_id' })
        .where(dataConditionMaterials)
        .then( async (rows)=>{
            if(rows.length > 0){
                var dataInsert = {
                    material_id: material_id,
                    buy_price: buy_price,
                    destination_id: destination_id,
                    created_by: created_by,
                    uom: uom,
                    qty: qty
                }
                await db('trxmaterials')
                        .insert(dataInsert)
                        .returning('id')
                        .then(resultInsert => {
                            response = { success: true, message: 'Transaction Material Succes', data: resultInsert }
                        })
                        .catch(error => {
                            response = { success: false, message: 'Failed Getting Data', data: error }
                        });
            }else{
              response = { success: false, message: 'Insufficient Privilegesss2' }
            }
        })
        .catch(error => {
            response = { success: false, message: 'Failed Getting Datad', data: error }
        })
        .finally(() => {
            Utils.sendStatus(res, 200, response);
        });
    }else{
        response = { success: false, message: 'Insufficient Privilegesss' }
        Utils.sendStatus(res, 200, response);
    }
}

/**
 * @route POST /buymaterialfromstore
 * @group Materials
 * @param {string} materials_id.query.required - Materials Id
 * @param {string} buy_price.query.required - Buy Price
 * @param {string} store_id.query.required - Store id
 * @param {string} uom.query.required - Unit Of Measurement
 * @param {string} qty.query.required - Quantity
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.buyMaterialFromStore = (req, res) => {
    var response = { success: false, message: 'Insufficient Privileges' }
    var userId = req.userId
    var storeId = req.storeId

    var material_id = req.query.materials_id
    var buy_price = req.query.buy_price
    var origin_id = req.query.store_id
    var destination_id = storeId
    var supplier_id = 0
    var created_by = userId
    var uom = req.query.uom
    var qty = req.query.qty
    if(storeId != 0){
        var dataInsert = {
            material_id: material_id,
            buy_price: buy_price,
            origin_id: origin_id,
            destination_id: destination_id,
            created_by: created_by,
            uom: uom,
            qty: qty
        }
        db('trxmaterials')
            .insert(dataInsert)
            .returning('id')
            .then(resultInsert => {
                response = { success: true, message: 'Transaction Material Succes', data: resultInsert }
            })
            .catch(error => {
                response = { success: false, message: 'Failed Getting Data', data: error }
            })
            .finally(() => {
                Utils.sendStatus(res, 200, response);
            });
    }else{
        Utils.sendStatus(res, 200, response);
    }
}

/**
 * @route GET /receive
 * @group Materials
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.getUnReceivedMaterials = (req, res) => {
  var userId = req.userId
  var storeId = req.storeId

  var dataCondition = {
      destination_id: storeId
  }
  var response = { success: false, message: 'Failed Get Data' }
  var query = `SELECT
                  trxmaterials.id,
                  materials.name,
                  materials.sku,
                  materials.uom,
                  trxmaterials.qty,
                  trxmaterials.uom
              FROM trxmaterials
              LEFT JOIN materials on materials.id = trxmaterials.material_id
              WHERE trxmaterials.destination_id = ${storeId} and trxmaterials.is_received = false`;
  rawQuery(query).then(
    (success) => {
      response.success = true;
      response.message = 'Success Get Data';
      response.data = success

      Utils.sendStatus(res, 200, response)
    },
    (error) => {
      response.error = error
      Utils.sendStatus(res, 200, response)
    }
  )
}

/**
 * @route GET /receive/{id}
 * @group Materials
 * @param {string} id.path.required - Material Transaction Id
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.receiveMaterial = (req, res) => {
  var userId = req.userId
  var storeId = req.storeId
  var transactionId = req.params.id

  var dataCondition = {
      id: transactionId
  }
  var dataUpdate = {
      is_received: true,
      received_by: userId
  }

  var response = { success: false, message: 'Failed Updating Data' }
  updateToTable('trxmaterials', dataCondition, dataUpdate).then(
    (success) => {
      response = { success: true, message: "Success Update Transaction Data", data: success }
      Utils.sendStatus(res, 200, response)
    },
    (error) => {
      response.error = error
      Utils.sendStatus(res, 200, response)
    }
  )
}
function initTrxMaterial(idMaterial, idStore){
  return new Promise((resolve, reject) => {
    var dataInsert = {
      material_id: idMaterial,
      buy_price: 0,
      origin_id: idStore,
      destination_id: idStore,
      qty: 0
    }

    db('trxmaterials')
      .insert(dataInsert)
      .returning('id')
      .then(async (rows) => {
        await initTrxIngridient(rows, idStore);
      })
      .catch(error => {
        reject(error)
      })
  });
}

function initTrxIngridient(idTrxMaterial, idStore){
  return new Promise((resolve, reject) => {
    var dataInsert = {
      trx_material_id: idTrxMaterial,
      qty_ingridient: 0
    }
    db('trxingridient')
      .insert(dataInsert)
      .returning('id')
      .then(rows => {
        resolve(rows)
      })
      .catch(error => {
        reject(error)
      })
  });

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

function getFromTable(table, condition){
    return new Promise((resolve, reject) => {
        db(table)
            .where(condition)
            .then(rows => {
                resolve(rows)
            })
            .catch(error => {
                reject(error)
            });
    });
}
function rawQuery(query){
  return new Promise(function(resolve, reject) {
    db.raw(query)
      .then(resultQuery => {
        resolve(resultQuery[0])
      })
      .catch(error => {
        reject(error)
      })
  });
}
