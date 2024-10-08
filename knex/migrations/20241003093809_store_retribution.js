/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('store_retribution', function (t) {
        t.increments('id').unsigned().primary();
        t.timestamps(true, true);
        t.integer('store_id').unsigned();
        t.foreign("store_id").references("store.id");
        t.integer('user_id').unsigned();
        t.foreign("user_id").references("user.id");
        t.text('month', 'longtext');
        t.text('year', 'longtext');
        t.text('price', 'longtext');
        t.text('status', 'longtext');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    let dropQuery = `DROP TABLE store_retribution`
    return knex.raw(dropQuery);  
};
