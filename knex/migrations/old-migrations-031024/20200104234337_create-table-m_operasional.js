
exports.up = function(knex) {
    return knex.schema.createTable('m_operasional', function (t) {
        t.increments('id').unsigned().primary();
        t.integer('store_id');
        t.string('key');
        t.integer('value');
        t.timestamp('created_at').notNull().defaultTo(knex.fn.now());
        t.integer('created_by');
    });
};

exports.down = function(knex) {
    let dropQuery = `DROP TABLE m_operasional`
    return knex.raw(dropQuery)
};
