
exports.up = function(knex) {
    return knex.schema
    .alterTable('transaction', (table) => {
      table.boolean('is_deleted').notNull().defaultTo(false);
    });
};

exports.down = function(knex) {
    return knex.schema
    .alterTable('transaction', table => {
      table.dropColumn('is_deleted');
    });
};
