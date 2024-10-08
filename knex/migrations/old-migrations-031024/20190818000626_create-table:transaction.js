
exports.up = function(knex) {
    return knex.schema.createTable('transaction', (table) => {
        table.increments('id').unsigned().primary();
        table.string('buyer');
        table.integer('store_id').unsigned().references('stores.id');
        table.integer('total_price').unsigned();
        table.integer('tax').unsigned();
        table.integer('service').unsigned();
        table.integer('discount').unsigned();
        table.integer('status').unsigned();
        table.integer('trx_by').unsigned().references('users.id');
        table.timestamp('date_created').notNull().defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
    let dropQuery = `DROP TABLE transaction`
    return knex.raw(dropQuery)  
};
