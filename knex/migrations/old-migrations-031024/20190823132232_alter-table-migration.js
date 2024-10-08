
exports.up = function(knex) {
    return knex.schema
    .alterTable('materials', (table) => {
        table.integer('company_id').unsigned().references('company.id');
        table.integer('store_id').unsigned().references('stores.id');
    });
};

exports.down = function(knex) {
    return knex.schema
    .alterTable('materials', table => {
        table.dropColumn('company_id');
        table.dropColumn('store_id');
    });
};
