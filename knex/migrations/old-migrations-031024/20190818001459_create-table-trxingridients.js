
exports.up = function(knex) {
    return knex.schema.createTable('trxingridient', (table) => {
        table.increments('id').unsigned().primary();
        table.integer('trx_product_id').unsigned().references('trxproducts.id');        
        table.integer('trx_material_id').unsigned().references('trxmaterials.id');
        table.integer('buy_price').unsigned();
        table.integer('created_by').unsigned().references('users.id');
        table.timestamp('date_created').notNull().defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
    let dropQuery = `DROP TABLE trxingridient`
    return knex.raw(dropQuery)  
};
