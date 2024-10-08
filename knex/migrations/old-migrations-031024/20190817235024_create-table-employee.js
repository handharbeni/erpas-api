
exports.up = function(knex) {
    return knex.schema.createTable('employee', (table) => {
        table.increments('id').unsigned().primary();
        table.integer('user_id').unsigned().references('users.id');
        table.integer('store_id').unsigned().references('stores.id');
        table.boolean('isPic');
        table.boolean('isOwner');
        table.boolean('isEmployee');
        table.integer('role');
        table.timestamp('date_created').notNull().defaultTo(knex.fn.now());
        table.timestamp('date_modified').notNull().defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
    let dropQuery = `DROP TABLE employee`
    return knex.raw(dropQuery)  
};
