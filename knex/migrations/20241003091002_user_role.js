/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('user_role', function (t) {
        t.increments('id').unsigned().primary();
        t.timestamps(true, true);
        t.integer('role_id').unsigned();
        t.foreign("role_id").references("role.id");
        t.integer('user_id').unsigned();
        t.foreign("user_id").references("user.id");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    let dropQuery = `DROP TABLE user_role`
    return knex.raw(dropQuery);  
};
