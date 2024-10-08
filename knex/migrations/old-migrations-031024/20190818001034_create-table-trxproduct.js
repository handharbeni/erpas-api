
exports.up = function(knex) {
    return knex.schema.createTable('trxproducts', (table) => {
        table.increments('id').unsigned().primary();
        table.integer('product_id').unsigned().references('products.id');
        table.integer('transaction_id').unsigned().references('transaction.id');
        table.integer('sell_price').unsigned();
        table.integer('qty').unsigned();
        table.string('uom');
        table.integer('created_by').unsigned().references('users.id');
        table.timestamp('date_created').notNull().defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
    let dropQuery = `DROP TABLE trxproducts`
    return knex.raw(dropQuery)  
};
