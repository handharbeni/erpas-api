
exports.up = function(knex) {
    return knex.schema
    .alterTable('transaction', (table) => {
        table.text('qr_value');
        table.text('bill_number');
        table.text('invoice_number');
        table.text('terminal_id');
        table.boolean('qr_is_paid').notNull().defaultTo(false);
    });
};

exports.down = function(knex) {
    return knex.schema
    .alterTable('transaction', table => {
        table.dropColumn('qr_value');
        table.dropColumn('bill_number');
        table.dropColumn('invoice_number');
        table.dropColumn('terminal_id');
        table.dropColumn('qr_is_paid');
    });
};