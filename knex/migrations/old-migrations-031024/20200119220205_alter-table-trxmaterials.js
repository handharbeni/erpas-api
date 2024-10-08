
exports.up = function(knex) {
    return knex.schema
    .alterTable('trxmaterials', (table) => {
      table.boolean('is_received').notNull().defaultTo(false);
    });
};

exports.down = function(knex) {
    return knex.schema
    .alterTable('trxmaterials', table => {
      table.dropColumn('is_received');
    });
};
