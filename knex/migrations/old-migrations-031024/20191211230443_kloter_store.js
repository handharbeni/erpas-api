
exports.up = function(knex) {
    return knex.schema.createTable('kloter_store', function (t) {
        t.increments('id').unsigned().primary();
        t.integer('id_store').notNull();
        t.integer('id_kloter').notNull();
    });
};

exports.down = function(knex) {
    let dropQuery = `DROP TABLE kloter_store`
    return knex.raw(dropQuery)
};
