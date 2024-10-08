
exports.up = function(knex) {
    return knex.schema.createTable('recipes', (table) => {
        table.increments('id').unsigned().primary();
        table.integer('product_id').unsigned().references('products.id');
        table.integer('material_id').unsigned().references('materials.id');
        table.integer('qty').unsigned();
        table.string('uom');
        table.integer('created_by').unsigned().references('users.id');
        table.timestamp('date_created').notNull().defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
    let dropQuery = `DROP TABLE recipes`
    return knex.raw(dropQuery)  
};
