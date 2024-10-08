
exports.up = function(knex) {
    return knex.schema.createTable('company', (table) => {
        table.increments('id').unsigned().primary();
        table.string('name').notNull();
        table.string('address').notNull();
        table.integer('subscription_type').unsigned();
        table.timestamp('subscription_end');
        table.integer('owner_id').unsigned().references('users.id');
        table.timestamp('date_created').notNull().defaultTo(knex.fn.now());
        table.timestamp('date_modified').notNull().defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
    let dropQuery = `DROP TABLE company`
    return knex.raw(dropQuery)  
};
