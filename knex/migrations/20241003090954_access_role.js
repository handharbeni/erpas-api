/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('access_role', function (t) {
        t.increments('id').unsigned().primary();
        t.timestamps(true, true);
        t.integer('role_id').unsigned();
        t.foreign("role_id").references("role.id");
        t.integer('endpoint_id').unsigned();
        t.foreign("endpoint_id").references("endpoint.id");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    let dropQuery = `DROP TABLE access_role`
    return knex.raw(dropQuery);  
};
