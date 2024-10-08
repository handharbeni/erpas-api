
exports.up = function(knex) {
    return knex.schema.createTable('withdrawal', function (t) {
        t.increments('id').unsigned().primary();
        t.integer('transaction_id');
        t.integer('kloter_id');
        t.integer('store_id');
        t.string('value').notNull();
        t.timestamp('start_periode').notNull().defaultTo(knex.fn.now());
        t.timestamp('end_periode').notNull().defaultTo(knex.fn.now());

        t.integer('withdraw_by').notNull();
        t.timestamp('withdraw_at').notNull().defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
    let dropQuery = `DROP TABLE withdrawal`
    return knex.raw(dropQuery)
};
