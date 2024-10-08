/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('block_store', function (t) {
        t.increments('id').unsigned().primary();
        t.timestamps(true, true);
        t.integer('user_id').unsigned();
        t.foreign("user_id").references("user.id");
        t.text('block', 'longtext');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    let dropQuery = `DROP TABLE block_store`
    return knex.raw(dropQuery);  
};
