/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('role', function (t) {
        t.increments('id').unsigned().primary();
        t.timestamps(true, true);
        t.text('role', 'longtext');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    let dropQuery = `DROP TABLE role`
    return knex.raw(dropQuery);  
};
