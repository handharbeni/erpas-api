
exports.up = function(knex) {
    return knex.schema
    .alterTable('master_kloter', (table) => {
        table.boolean('isActive');
    });
};

exports.down = function(knex) {
    return knex.schema
    .alterTable('master_kloter', table => {
        table.dropColumn('isActive');
    });
};
