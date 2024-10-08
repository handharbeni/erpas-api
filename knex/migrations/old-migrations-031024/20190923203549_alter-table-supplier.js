
exports.up = function(knex) {
    return knex.schema
    .alterTable('suppliers', (table) => {
        table.integer('store_id').unsigned().references('stores.id');
    });
};

exports.down = function(knex) {
    return knex.schema
    .alterTable('suppliers', table => {
        table.dropForeign('store_id');
        table.dropColumn('store_id');
    });
};
