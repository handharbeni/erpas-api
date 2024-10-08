
exports.up = function(knex) {
    return knex.schema
    .alterTable('products', (table) => {
        table.string('price');
    });
};

exports.down = function(knex) {
    return knex.schema
    .alterTable('products', table => {
        table.dropColumn('price');
    });
};
