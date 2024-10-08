
exports.up = function(knex) {
    return knex.schema
    .alterTable('transaction', (table) => {
      table.boolean('is_withdraw_operasional').notNull().defaultTo(false);
    });
};

exports.down = function(knex) {
    return knex.schema
    .alterTable('transaction', table => {
      table.dropColumn('is_withdraw_operasional');
    });
};
