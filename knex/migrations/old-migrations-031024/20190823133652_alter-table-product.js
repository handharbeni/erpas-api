
exports.up = function(knex) {
    return knex.schema
    .alterTable('products', (table) => {
        table.integer('company_id').unsigned().references('company.id');
    });
};

exports.down = function(knex) {
    return knex.schema
    .alterTable('products', table => {
        table.dropColumn('company_id');
    });
};
