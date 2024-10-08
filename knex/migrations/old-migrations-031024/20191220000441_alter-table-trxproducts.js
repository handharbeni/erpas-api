
exports.up = function(knex) {
    return knex.schema
    .alterTable('trxproducts', (table) => {
        table.string('buy_price');
    });
};

exports.down = function(knex) {
    return knex.schema
    .alterTable('trxproducts', table => {
        table.dropColumn('buy_price');
    });
};
