
exports.up = function(knex) {
    return knex.schema.createTable('materials', (table) => {
        table.increments('id').unsigned().primary();
        table.string('name').notNull();
        table.string('sku').notNull();
        table.string('uom').notNull();
        table.integer('supplier_id').unsigned().references('suppliers.id');
        table.timestamp('date_created').notNull().defaultTo(knex.fn.now());
        table.timestamp('date_modified').notNull().defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
    let dropQuery = `DROP TABLE materials`
    return knex.raw(dropQuery)  
};
