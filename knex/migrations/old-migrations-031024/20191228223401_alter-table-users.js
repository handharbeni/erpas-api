
exports.up = function(knex) {
    return knex.schema
    .alterTable('users', (table) => {
      table.text('image', 'longtext').alter();
    });
};

exports.down = function(knex) {
    return knex.schema
    .alterTable('users', table => {
      table.string('image').alter();
    });
};
