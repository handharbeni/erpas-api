
exports.up = function(knex) {
    return knex.schema
    .alterTable('m_category', (table) => {
      table.integer('store_id').notNull().defaultTo(0);
    });
};

exports.down = function(knex) {
    return knex.schema
    .alterTable('m_category', table => {
      table.dropColumn('store_id');
    });
};
