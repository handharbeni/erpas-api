'use strict'
var config = require('../../tools/config');
var db = require('../../knex/knex');
var Utils = require('../utils/utils');

const request = require('request');
const moment = require('moment');

/**
 * @route GET /requestjadwal
 * @group Sholat
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 */
exports.requestJadwalSholat = (req, res) => {
  // var url = `https://muslimsalat.com/malang/weekly.json?key=97de31b1961c79a91e7e602b5ca8bb2c`
  var url = `https://api.pray.zone/v2/times/this_week.json?city=malang&timeformat=1`
  request(url, function (error, response, body) {
    if (!error) {
      if (response.statusCode == 200) {
        var jsonJadwal = JSON.parse(body);
        console.log(jsonJadwal.code);
        var items = jsonJadwal.results.datetime
        for(var itemJadwal in items){
          var tanggal = items[itemJadwal].date.gregorian
          var subuh = items[itemJadwal].times.Fajr
          var duhur = items[itemJadwal].times.Dhuhr
          var ashar = items[itemJadwal].times.Asr
          var maghrib = items[itemJadwal].times.Maghrib
          var isya = items[itemJadwal].times.Isha
          var shurooq = items[itemJadwal].times.Sunrise

          var dataInsert = {
            tanggal: tanggal,
            subuh: subuh,
            duhur: duhur,
            ashar: ashar,
            maghrib: maghrib,
            isya: isya,
            shurooq: shurooq
          }

          db('jadwal_sholat')
            .insert(dataInsert)
            .then(success => {

            })
            .catch(error => {

            })
            .finally(() => {

            })
        }
        Utils.sendStatus(res, 200, { success: true, message: 'Schedule has been fetched' });
      }
    }
  });
}

/**
 * @route GET /checkjadwalsholat
 * @group Sholat
 * @returns {object} 200 - { "success": true, "message": "Message Success, Message Error", "data": "if any, could be object / json" }
 * @produces application/json
 * @consumes application/x-www-form-urlencoded
 * @security JWT
 */
exports.checkJadwalSholat = (req, res) => {

  var response = { success: false, message: 'Schedule has been fetched' }
  var storeId = req.storeId

  if (storeId != 0) {
    var fullDate = moment().format("YYYY-M-D");
    var timeNow = moment().format("YYYY-M-D hh:mm A");
    var onTime = false;
    var dataSelect = {
      tanggal: fullDate
    }
    var vSuccess = false
    var vMessage = 'Selamat Bekerja :)'
    response = { success: vSuccess, message: vMessage }
    db('stores')
      .where({ id: storeId })
      .then(async (valueStores) => {
        if (valueStores.length > 0) {
          var configStore = valueStores[0]
          if (configStore.pray_time_active) {
            var tBefore = configStore.time_before;
            var tAfter = configStore.time_after;
            await db('jadwal_sholat')
              .where(dataSelect)
              .then((success) => {
                if(success.length > 0){
                  var data = success[0];
                  var format = "YYYY-M-D hh:mm A"

                  var sSubuh = `${data.tanggal} ${data.subuh}`
                  var subuh = moment(sSubuh, format);
                  var start_subuh = subuh.clone().subtract(tBefore, 'm');
                  var end_subuh = subuh.clone().add(tAfter, 'm');

                  var sDuhur = `${data.tanggal} ${data.duhur}`
                  var duhur = moment(sDuhur, format);
                  var start_duhur = duhur.clone().subtract(tBefore, 'm');
                  var end_duhur = duhur.clone().add(tAfter, 'm');

                  var sAshar = `${data.tanggal} ${data.ashar}`
                  var ashar = moment(sAshar, format);
                  var start_ashar = ashar.clone().subtract(tBefore, 'm');
                  var end_ashar = ashar.clone().add(tAfter, 'm');

                  var sMaghrib = `${data.tanggal} ${data.maghrib}`
                  var maghrib = moment(sMaghrib, format);
                  var start_maghrib = maghrib.clone().subtract(tBefore, 'm');
                  var end_maghrib = maghrib.clone().add(tAfter, 'm');

                  var sIsya = `${data.tanggal} ${data.isya}`
                  var isya = moment(sIsya, format);
                  var start_isya = isya.clone().subtract(tBefore, 'm');
                  var end_isya = isya.clone().add(tAfter, 'm');

                  if (start_subuh.isSameOrBefore(timeNow) && end_subuh.isAfter(timeNow)) {
                    vSuccess = true
                    vMessage = 'Sudah Memasuki Waktu Shalat Subuh '
                  }else if(start_duhur.isSameOrBefore(timeNow) && end_duhur.isAfter(timeNow)){
                    vSuccess = true
                    vMessage = 'Sudah Memasuki Waktu Shalat Duhur '
                  }else if(start_ashar.isSameOrBefore(timeNow) && end_ashar.isAfter(timeNow)){
                    vSuccess = true
                    vMessage = 'Sudah Memasuki Waktu Shalat Ashar '
                  }else if(start_maghrib.isSameOrBefore(timeNow) && end_maghrib.isAfter(timeNow)){
                    vSuccess = true
                    vMessage = 'Sudah Memasuki Waktu Shalat Maghrib '
                  }else if(start_isya.isSameOrBefore(timeNow) && end_isya.isAfter(timeNow)){
                    vSuccess = true
                    vMessage = 'Sudah Memasuki Waktu Shalat Isya '
                  }
                }
                response = { success: vSuccess, message: vMessage }
              })
              .catch((error) => {
                vSuccess = false
                vMessage = error
                response = { success: vSuccess, message: vMessage }
              })
          }
        }
      })
      .finally(() => {
        Utils.sendStatus(res, 200, response);
      })
  }else{
    Utils.sendStatus(res, 200, {success: false, message: 'Unauthorized Token'});
  }
}
