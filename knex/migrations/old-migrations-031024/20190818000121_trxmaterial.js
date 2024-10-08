
exports.up = function(knex) {
    return knex.schema.createTable('trxmaterials', (table) => {
        table.increments('id').unsigned().primary();
        table.integer('material_id').unsigned().references('materials.id');
        table.string('buy_price');
        table.string('sell_price');
        table.integer('origin_id').unsigned().references('stores.id');
        table.integer('destination_id').unsigned().references('stores.id');
        table.integer('status_trx').unsigned();
        table.string('uom');
        table.integer('qty').unsigned();
        table.integer('status').unsigned();
        table.integer('created_by').unsigned().references('users.id');
        table.timestamp('date_created').notNull().defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
    let dropQuery = `DROP TABLE trxmaterials`
    return knex.raw(dropQuery)  
};
