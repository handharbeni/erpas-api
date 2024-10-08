
exports.up = function(knex) {
    return knex.schema.createTable('suppliers', (table) => {
        table.increments('id').unsigned().primary();
        table.string('name').notNull();
        table.integer('created_by').unsigned().references('users.id');
        table.integer('modified_by').unsigned().references('users.id');
        table.timestamp('date_created').notNull().defaultTo(knex.fn.now());
        table.timestamp('date_modified').notNull().defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
    let dropQuery = `DROP TABLE suppliers`
    return knex.raw(dropQuery)  
};
