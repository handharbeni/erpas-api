
exports.up = function(knex) {
    return knex.schema.createTable('jadwal_sholat', function (t) {
        t.increments('id').unsigned().primary();
        t.string('tanggal').notNull();
        t.string('subuh').notNull();
        t.string('duhur').notNull();
        t.string('ashar').notNull();
        t.string('maghrib').notNull();
        t.string('isya').notNull();
        t.string('shurooq').notNull();
        t.unique('tanggal');
    });
};

exports.down = function(knex) {
    let dropQuery = `DROP TABLE jadwal_sholat`
    return knex.raw(dropQuery)
};
