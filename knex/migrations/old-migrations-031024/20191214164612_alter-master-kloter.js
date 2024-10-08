
exports.up = function(knex) {
    return knex.schema
    .alterTable('master_kloter', (table) => {
        table.integer('active');
    });
};

exports.down = function(knex) {
    return knex.schema
    .alterTable('master_kloter', table => {
        table.dropColumn('active');
    });
};
