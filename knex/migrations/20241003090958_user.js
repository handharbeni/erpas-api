/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('user', function (t) {
        t.increments('id').unsigned().primary();
        t.timestamps(true, true);
        t.text('username', 'longtext');
        t.text('password', 'longtext');
        t.text('email', 'longtext');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    let dropQuery = `DROP TABLE user`
    return knex.raw(dropQuery);  
};
