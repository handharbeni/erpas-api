/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('user_log', function (t) {
        t.increments('id').unsigned().primary();
        t.timestamps(true, true);
        t.integer('user_id').unsigned();
        t.foreign("user_id").references("user.id");
        t.integer('endpoint_id').unsigned();
        t.foreign("endpoint_id").references("endpoint.id");
        t.text('data', 'longtext');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    let dropQuery = `DROP TABLE user_log`
    return knex.raw(dropQuery);  
};
