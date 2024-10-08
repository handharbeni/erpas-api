
exports.up = function(knex) {
    return knex.schema
    .alterTable('products', (table) => {
      table.integer('category_id').notNull().defaultTo(0);
    });
};

exports.down = function(knex) {
    return knex.schema
    .alterTable('products', table => {
      table.dropColumn('category_id');
    });
};
