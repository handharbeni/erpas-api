
exports.up = function(knex) {
    return knex.schema
    .alterTable('users', (table) => {
        table.string('list_outlet');
    });
};

exports.down = function(knex) {
    return knex.schema
    .alterTable('users', table => {
        table.dropColumn('list_outlet');
    });
};
