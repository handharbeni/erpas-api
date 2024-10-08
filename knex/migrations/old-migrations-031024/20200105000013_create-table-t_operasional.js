
exports.up = function(knex) {
    return knex.schema.createTable('t_operasional', function (t) {
        t.increments('id').unsigned().primary();
        t.integer('store_id');
        t.string('key_operasional')
        t.integer('value_operasional');
        t.timestamp('start_periode').notNull().defaultTo(knex.fn.now());
        t.timestamp('end_periode').notNull().defaultTo(knex.fn.now());
        t.timestamp('withdraw_at').notNull().defaultTo(knex.fn.now());
        t.integer('withdraw_by');
    });
};

exports.down = function(knex) {
    let dropQuery = `DROP TABLE t_operasional`
    return knex.raw(dropQuery)
};
