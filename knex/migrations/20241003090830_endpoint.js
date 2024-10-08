/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('endpoint', function (t) {
        t.increments('id').unsigned().primary();
        t.timestamps(true, true);
        t.text('endpoint', 'longtext');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    let dropQuery = `DROP TABLE endpoint`
    return knex.raw(dropQuery);  
};
