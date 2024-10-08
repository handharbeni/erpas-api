
exports.up = function(knex) {
    return knex.schema
    .alterTable('products', (table) => {
        table.string('buy_price');
    });
};

exports.down = function(knex) {
    return knex.schema
    .alterTable('products', table => {
        table.dropColumn('buy_price');
    });
};
