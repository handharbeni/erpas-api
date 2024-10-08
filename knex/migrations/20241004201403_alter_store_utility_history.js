/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .alterTable('store_utility_history', (table) => {
        table.bigInteger('year').alter();
        table.bigInteger('month').alter();
    });  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
    .alterTable('store_utility_history', table => {
        table.text('price', 'longtext').alter();
        table.text('status', 'longtext').alter();
    });

};