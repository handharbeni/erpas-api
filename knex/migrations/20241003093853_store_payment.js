/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('store_payment', function (t) {
        t.increments('id').unsigned().primary();
        t.timestamps(true, true);
        t.integer('store_transaction_id').unsigned();
        t.foreign("store_transaction_id").references("store_transaction.id");
        t.integer('user_id').unsigned();
        t.foreign("user_id").references("user.id");
        t.text('price', 'longtext');
        t.text('status', 'longtext');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    let dropQuery = `DROP TABLE store_payment`
    return knex.raw(dropQuery);  
};
