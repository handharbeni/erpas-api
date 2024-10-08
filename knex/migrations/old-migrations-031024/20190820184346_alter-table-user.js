
exports.up = function(knex) {
    return knex.schema
    .alterTable('users', (table) => {
      table.string('name').nullable().alter();
      table.string('identity_number').nullable().alter();
      table.string('address').nullable().alter();
      table.string('phone_number').nullable().alter();
      table.string('pin').nullable().alter();
      table.string('image').nullable().alter();
    });
};

exports.down = function(knex) {
    return knex.schema
    .alterTable('users', table => {
      table.string('name').notNullable().alter();
      table.string('identity_number').notNullable().alter();
      table.string('address').notNullable().alter();
      table.string('phone_number').notNullable().alter();
      table.string('pin').notNullable().alter();
      table.string('image').notNullable().alter();
    });
};
