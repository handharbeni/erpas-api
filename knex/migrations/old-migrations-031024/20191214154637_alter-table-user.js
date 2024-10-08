
exports.up = function(knex) {
    return knex.schema
    .alterTable('users', (table) => {
        table.integer('id_company');
    });
};

exports.down = function(knex) {
    return knex.schema
    .alterTable('users', table => {
        table.dropColumn('id_company');
    });
};
