
exports.up = function(knex) {
    return knex.schema
    .alterTable('products', (table) => {
      table.text('image', 'longtext').alter();
    });
};

exports.down = function(knex) {
    return knex.schema
    .alterTable('products', table => {
      table.string('image').alter();
    });
};
