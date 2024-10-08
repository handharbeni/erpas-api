
exports.up = function(knex) {
    return knex.schema
    .alterTable('trxproducts', (table) => {
        table.string('hpp');
    });
};

exports.down = function(knex) {
    return knex.schema
    .alterTable('trxproducts', table => {
        table.dropColumn('hpp');
    });
};
