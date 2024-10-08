/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('store_transaction', function (t) {
        t.increments('id').unsigned().primary();
        t.timestamps(true, true);
        t.integer('store_id').unsigned();
        t.foreign("store_id").references("store.id");
        t.integer('user_id').unsigned();
        t.foreign("user_id").references("user.id");
        t.integer('tenant_id').unsigned();
        t.foreign("tenant_id").references("tenant_data.id");
        t.text('start', 'longtext');
        t.text('end', 'longtext');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    let dropQuery = `DROP TABLE store_transaction`
    return knex.raw(dropQuery);  
};
