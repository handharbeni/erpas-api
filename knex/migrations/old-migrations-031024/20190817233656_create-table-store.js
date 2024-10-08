
exports.up = function(knex) {
    return knex.schema.createTable('stores', (table) => {
        table.increments('id').unsigned().primary();
        table.string('name').notNull();
        table.string('address').notNull();
        table.integer('store_type').unsigned();
        table.integer('status').unsigned();
        table.string('open').notNull();
        table.string('close').notNull();
        table.integer('company_id').unsigned().references('company.id');
        table.integer('created_by').unsigned().references('users.id');
        table.integer('modified_by').unsigned().references('users.id');
        table.timestamp('date_created').notNull().defaultTo(knex.fn.now());
        table.timestamp('date_modified').notNull().defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
    let dropQuery = `DROP TABLE stores`
    return knex.raw(dropQuery)  
};
