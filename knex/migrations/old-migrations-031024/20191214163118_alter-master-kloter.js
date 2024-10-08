
exports.up = function(knex) {
    return knex.schema
    .alterTable('master_kloter', (table) => {
        table.integer('id_company');
    });
};

exports.down = function(knex) {
    return knex.schema
    .alterTable('master_kloter', table => {
        table.dropColumn('id_company');
    });
};
