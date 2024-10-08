
exports.up = function(knex) {
    return knex.schema.createTable('products', (table) => {
        table.increments('id').unsigned().primary();
        table.string('name').notNull();
        table.string('sku').notNull();
        table.integer('store_id').unsigned().references('stores.id');
        table.string('desc');
        table.integer('status').unsigned();
        table.string('image');
        table.string('uom');        
        table.integer('created_by').unsigned().references('users.id');
        table.integer('modified_by').unsigned().references('users.id');
        table.timestamp('date_created').notNull().defaultTo(knex.fn.now());
        table.timestamp('date_modified').notNull().defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
    let dropQuery = `DROP TABLE products`
    return knex.raw(dropQuery)  
};
