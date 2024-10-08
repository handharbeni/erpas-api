
exports.up = function(knex) {
    return knex.schema
    .alterTable('users', (table) => {
        table.boolean('is_investor');
        table.integer('outlet_id').unsigned();
    });
};

exports.down = function(knex) {
    return knex.schema
    .alterTable('users', table => {
        table.dropColumn('is_investor');
        table.dropColumn('outlet_id');
    });
};
