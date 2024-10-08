
exports.up = function(knex) {
    return knex.schema.createTable('kloter_user', function (t) {
        t.increments('id').unsigned().primary();
        t.integer('id_user').notNull();
        t.integer('id_kloter').notNull();
        t.string('percentage').notNull();
    });
};

exports.down = function(knex) {
    let dropQuery = `DROP TABLE kloter_user`
    return knex.raw(dropQuery)
};
