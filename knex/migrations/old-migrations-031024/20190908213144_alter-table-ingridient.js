
exports.up = function(knex) {
    return knex.schema
    .alterTable('trxingridient', (table) => {
        table.integer('qty_ingridient').unsigned();
    });
};

exports.down = function(knex) {
    return knex.schema
    .alterTable('trxingridient', table => {
        table.dropForeign('qty_ingridient');
    });
};
