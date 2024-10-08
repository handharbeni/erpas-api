/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('store', function (t) {
        t.increments('id').unsigned().primary();
        t.timestamps(true, true);
        t.integer('user_id').unsigned();
        t.foreign("user_id").references("user.id");
        t.integer('config_id').unsigned();
        t.foreign("config_id").references("config.id");
        t.integer('block_id').unsigned();
        t.foreign("block_id").references("block_store.id");
        t.text('store_number', 'longtext');
        t.text('price_rent', 'longtext');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    let dropQuery = `DROP TABLE store`
    return knex.raw(dropQuery);  
};
