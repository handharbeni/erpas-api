'use strict'
var jwt = require('jsonwebtoken');
var config = require('../../tools/config');
var db = require('../../knex/knex');
var Utils = require('../utils/utils');
var bcrypt = require('bcryptjs');

// token user eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwic3RvcmVfaWQiOjAsImNvbXBhbnlfaWQiOjAsImlhdCI6MTU2NzYwMTkyNywiZXhwIjoxNTY4MjA2NzI3fQ.sM-vuMQs7KOO1FVcaM0VuUKuPGMVU0FAf9KRvHou4bw
// token store eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwic3RvcmVfaWQiOiI0IiwiY29tcGFueV9pZCI6MCwiaWF0IjoxNTY3NjAyMDYyLCJleHAiOjE1NjgyMDY4NjJ9.7kg-vdrPkXmyxHx8vZ6N7CcbWTy8-01kWImPvV8IO0A
/**
 * @route GET /employee
 * @group Manajemen Employee
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.getEmployee = (req, res) => {
    var storeId = req.storeId
    var userid = req.userId
    var response = { success:false, message:'Failed To Getting Data' }
    var dataCondition = {
        'stores.id': storeId
    }
    if(storeId != 0){
        db.from('employee')
        .select('employee.*', 'stores.*', 'users.*', 'users.name as name')
        .join('users', {'users.id': 'employee.user_id'})
        .join('stores', {'stores.id': 'employee.store_id'})
        .where(dataCondition)
        .then(rows=>{
            if(rows.length > 0){
                response = { success: true, message: 'Success Getting Data', data:rows }
            }else{
                response = { success: false, message: 'Data Not Found' }
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
 * @route POST /employee
 * @group Manajemen Employee
 * @param {string} email.query.required - Email User
 * @param {integer} isPic.query.required - IsPIC 0 = false, 1 = true
 * @param {integer} isOwner.query.required - IsOwner 0 = false, 1 = true
 * @param {integer} isEmployee.query.required - IsEmployee 0 = false, 1 = true
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.addEmployee = (req, res) => {
    var storeId = req.storeId
    var userId = req.userId
    var emailEmployee = req.query.email
    var isPic = req.query.isPic
    var isOwner = req.query.isOwner
    var isEmployee = req.query.isEmployee
    var response = { success: true, message:'' }
    var dataCondition = {
        'employee.store_id': storeId,
        'employee.isOwner': 1,
        'employee.user_id': userId
    }
    console.log(dataCondition)
    if(storeId != 0){
        db('employee')
        // .join('users', {'users.id': 'employee.user_id'})
        // .join('stores', {'stores.id': 'employee.store_id'})
        .where(dataCondition)
        .then(async (rows)=>{
            if(rows.length > 0){
                var dataConditionEmployee = {
                    email: emailEmployee
                }
                await db('users')
                        .where(dataConditionEmployee)
                        .then(async (rowsUsers) => {
                            if(rowsUsers.length < 1){
                              var dataInsertUser = {
                                  name: req.query.name,
                                  email: req.query.email,
                                  username: req.query.email,
                                  password: bcrypt.hashSync(req.query.password, 8)
                              }
                              await db('users')
                                  .insert(dataInsertUser)
                                  .then((resultInsertUser) => {
                                    var dataInsertEmployee = {
                                        user_id: resultInsertUser[0],
                                        store_id: storeId,
                                        isPic: isPic,
                                        isOwner: isOwner,
                                        isEmployee: isEmployee
                                    }
                                    db('employee')
                                        .insert(dataInsertEmployee)
                                        .then((resultInsertEmployee) => {
                                          console.log('Insert employee', dataInsertEmployee, resultInsertEmployee[0]);
                                            response = { success: true, message:'Employee Has been added', data: resultInsertEmployee }
                                        })
                                        .catch(error => {
                                            response = { success: false, message: 'Failed To Insert Employee', data:error }
                                        });
                                  })
                                  .catch(error => {
                                      response = { success: false, message: 'Failed To Insert User', data:error }
                                  });
                            }else{
                                var dataInsertEmployee = {
                                    user_id: rowsUsers[0].id,
                                    store_id: storeId,
                                    isPic: isPic,
                                    isOwner: isOwner,
                                    isEmployee: isEmployee
                                }
                                await db('employee')
                                    .insert(dataInsertEmployee)
                                    .then((resultInsertEmployee) => {
                                      console.log('Insert employee', dataInsertEmployee, resultInsertEmployee[0]);
                                        response = { success: true, message:'Employee Has been added', data: resultInsertEmployee }
                                    })
                                    .catch(error => {
                                        response = { success: false, message: 'Failed To Insert Employee', data:error }
                                    });
                            }
                        })
                        .catch(error => {
                            response = { success: false, message: 'Failed To Check Email', data:error }
                        });

            }else{
                response = { success: false, message: 'Insufficient Privileges' }
            }
        })
        .catch(error => {
            response = { success: false, message: 'Failed To Check Owner', data:error }
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
 * @route PUT /employee
 * @group Manajemen Employee
 * @param {string} email.query.required - Email User
 * @param {integer} isPic.query.required - IsPIC 0 = false, 1 = true
 * @param {integer} isOwner.query.required - IsOwner 0 = false, 1 = true
 * @param {integer} isEmployee.query.required - IsEmployee 0 = false, 1 = true
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.updateEmployee = (req, res) => {
    var storeId = req.storeId
    var userId = req.userId
    var emailEmployee = req.query.email
    var isPic = req.query.isPic
    var isOwner = req.query.isOwner
    var isEmployee = req.query.isEmployee
    var response = { success:false, message:'Failed To Getting Data' }
    var dataCondition = {
        'employee.store_id': storeId,
        'employee.isOwner': 1,
        'employee.user_id': userId
    }
    if(storeId != 0){
        db('employee')
        // .join('users', {'users.id': 'employee.user_id'})
        // .join('stores', {'stores.id': 'employee.store_id'})
        .where(dataCondition)
        .then(async (rows)=>{
            if(rows.length > 0){
                // response = { succes: true, message: 'haha', data: rows }
                var dataConditionEmployee = {
                    email: emailEmployee
                }
                await db('users')
                        .where(dataConditionEmployee)
                        .then(async (rowsUsers) => {
                            if(rowsUsers.length > 0){
                                var dataConditionUpdate = {
                                    user_id: rowsUsers[0].id,
                                    store_id: storeId,
                                }
                                var dataUpdate = {
                                    isPic: isPic,
                                    isOwner: isOwner,
                                    isEmployee: isEmployee
                                }
                                await db('employee')
                                    .where(dataConditionUpdate)
                                    .update(dataUpdate)
                                    .then((resultInsert) => {
                                        response = { succes: true, message:'Employee Has been Updated', data: resultInsert }
                                    })
                                    .catch(error => {
                                        response = { success: false, message: 'Failed To Getting Data', data:error }
                                    });
                            }else{
                                response = { success: false, message: 'User Not Found' }
                            }
                        })
                        .catch(error => {
                            response = { success: false, message: 'Failed To Getting Data', data:error }
                        });

            }else{
                response = { success: false, message: 'Insufficient Privileges' }
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
 * @route DELETE /employee
 * @group Manajemen Employee
 * @param {string} email.query.required - Email User
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.deleteEmployee = (req, res) => {
    var storeId = req.storeId
    var userId = req.userId
    var emailEmployee = req.query.email
    var response = { success:false, message:'Failed To Getting Data' }
    var dataCondition = {
        'employee.store_id': storeId,
        'employee.isOwner': 1,
        'employee.user_id': userId
    }
    if(storeId != 0){
        db('employee')
        // .join('users', {'users.id': 'employee.user_id'})
        // .join('stores', {'stores.id': 'employee.store_id'})
        .where(dataCondition)
        .then(async (rows)=>{
          console.log('employee', dataCondition, rows);
            if(rows.length > 0){
                // response = { succes: true, message: 'haha', data: rows }
                var dataConditionEmployee = {
                    email: emailEmployee
                }
                await db('users')
                        .where(dataConditionEmployee)
                        .then(async (rowsUsers) => {
                            if(rowsUsers.length > 0){
                                var dataDelete = {
                                    user_id: rowsUsers[0].id,
                                    store_id: storeId
                                }
                                await db('employee')
                                    .where(dataDelete)
                                    .del()
                                    .returning('id');
                                response = { success: true, message:'Employee Has been remove' }
                            }else{
                                response = { success: false, message: 'User Not Found' }
                            }
                        })
                        .catch(error => {
                            response = { success: false, message: 'Failed To Getting Data', data:error }
                        });

            }else{
                response = { success: false, message: 'Insufficient Privileges' }
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
