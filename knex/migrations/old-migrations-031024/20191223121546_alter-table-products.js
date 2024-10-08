
exports.up = function(knex) {
    return knex.schema
    .alterTable('stores', (table) => {
        table.boolean('pray_time_active').defaultTo(false);
        table.integer('time_before').defaultTo(5);
        table.integer('time_after').defaultTo(10);
    });
};

exports.down = function(knex) {
    return knex.schema
    .alterTable('stores', table => {
        table.dropColumn('pray_time_active');
        table.dropColumn('time_before');
        table.dropColumn('time_after');
    });
};
