/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('store_utility', function (t) {
        t.increments('id').unsigned().primary();
        t.timestamps(true, true);
        t.integer('store_id').unsigned();
        t.foreign("store_id").references("store.id");
        t.integer('user_id').unsigned();
        t.foreign("user_id").references("user.id");
        t.integer('utility_id').unsigned();
        t.foreign("utility_id").references("utility_store.id");
        t.text('value', 'longtext');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    let dropQuery = `DROP TABLE store_utility`
    return knex.raw(dropQuery);  
};
