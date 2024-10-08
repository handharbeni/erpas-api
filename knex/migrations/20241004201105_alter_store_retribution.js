/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .alterTable('store_retribution', (table) => {
        table.bigInteger('month').alter();
        table.bigInteger('year').alter();
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
    .alterTable('store_retribution', table => {
        table.text('month', 'longtext').alter();
        table.text('year', 'longtext').alter();
        table.text('price', 'longtext').alter();
        table.text('status', 'longtext').alter();
    });

};