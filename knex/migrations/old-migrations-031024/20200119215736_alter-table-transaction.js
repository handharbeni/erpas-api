
exports.up = function(knex) {
    return knex.schema
    .alterTable('transaction', (table) => {
      table.integer('deleted_by').notNull().defaultTo(0);
    });
};

exports.down = function(knex) {
    return knex.schema
    .alterTable('transaction', table => {
      table.dropColumn('deleted_by');
    });
};
