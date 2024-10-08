/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .alterTable('store_payment', (table) => {
        table.bigInteger('price').alter();
        table.boolean('status').alter();
    });  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
    .alterTable('store_payment', table => {
        table.text('price', 'longtext').alter();
        table.text('status', 'longtext').alter();
    });

};