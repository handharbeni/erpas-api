
exports.up = function(knex) {
    return knex.schema.createTable('invoices', (table) => {
        table.increments('id').unsigned().primary();
        table.integer('transaction_id').unsigned().references('transaction.id');
        table.integer('created_by').unsigned().references('users.id');
        table.timestamp('date_created').notNull().defaultTo(knex.fn.now());
        table.integer('print_count').unsigned();
    });
};

exports.down = function(knex) {
    let dropQuery = `DROP TABLE invoices`
    return knex.raw(dropQuery)  
};
