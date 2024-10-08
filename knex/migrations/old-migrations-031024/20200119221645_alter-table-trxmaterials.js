
exports.up = function(knex) {
    return knex.schema
    .alterTable('trxmaterials', (table) => {
      table.integer('received_by').notNull().defaultTo(0);
    });
};

exports.down = function(knex) {
    return knex.schema
    .alterTable('trxmaterials', table => {
      table.dropColumn('received_by');
    });
};
