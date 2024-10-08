
exports.up = function(knex) {
    return knex.schema
    .alterTable('transaction', (table) => {
      table.string('transaction_id');
    });
};

exports.down = function(knex) {
    return knex.schema
    .alterTable('transaction', table => {
      table.dropColumn('transaction_id');
    });
};
