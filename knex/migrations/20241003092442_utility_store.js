/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('utility_store', function (t) {
        t.increments('id').unsigned().primary();
        t.timestamps(true, true);
        t.integer('user_id').unsigned();
        t.foreign("user_id").references("user.id");
        t.text('value', 'longtext');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    let dropQuery = `DROP TABLE utility_store`
    return knex.raw(dropQuery);  
};
