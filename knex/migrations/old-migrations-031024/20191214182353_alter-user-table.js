
exports.up = function(knex) {
    return knex.schema
    .alterTable('users', (table) => {
        table.string('percentage');
    });
};

exports.down = function(knex) {
    return knex.schema
    .alterTable('users', table => {
        table.dropColumn('percentage');
    });
};
