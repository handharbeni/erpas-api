
exports.up = function(knex) {
    return knex.schema.createTable('master_kloter', function (t) {
        t.increments('id').unsigned().primary();
        t.timestamp('date_created').notNull().defaultTo(knex.fn.now());
        t.timestamp('date_start').notNull().defaultTo(knex.fn.now());
        t.timestamp('date_end').notNull().defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
    let dropQuery = `DROP TABLE master_kloter`
    return knex.raw(dropQuery)
};
