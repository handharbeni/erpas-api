
exports.up = function(knex) {
    return knex.schema.createTable('users', (table) => {
        table.increments('id').unsigned().primary();
        table.string('name').notNull();
        table.string('identity_number').notNull();
        table.string('address').notNull();
        table.string('phone_number').notNull();
        table.string('username').notNull();
        table.string('email').notNull();
        table.string('password').notNull();
        table.string('pin').notNull();
        table.boolean('is_changed_pin');
        table.string('image').notNull();
        table.timestamp('date_created').notNull().defaultTo(knex.fn.now());
        table.timestamp('date_modified').notNull().defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
    let dropQuery = `DROP TABLE users`
    return knex.raw(dropQuery)    
};
