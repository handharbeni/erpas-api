/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('tenant_data', function (t) {
        t.increments('id').unsigned().primary();
        t.timestamps(true, true);
        t.integer('user_id').unsigned();
        t.foreign("user_id").references("user.id");
        t.text('name', 'longtext');
        t.text('address', 'longtext');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    let dropQuery = `DROP TABLE tenant_data`
    return knex.raw(dropQuery);  
};
