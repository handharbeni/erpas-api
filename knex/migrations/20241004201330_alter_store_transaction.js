/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .alterTable('store_transaction', (table) => {
        table.bigInteger('start').alter();
        table.bigInteger('end').alter();
    });  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
    .alterTable('store_transaction', table => {
        table.text('start', 'longtext').alter();
        table.text('end', 'longtext').alter();
    });

};