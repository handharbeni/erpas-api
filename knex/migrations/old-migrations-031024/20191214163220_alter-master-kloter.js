
exports.up = function(knex) {
    return knex.schema
    .alterTable('master_kloter', (table) => {
        table.string('nama_kloter');
    });
};

exports.down = function(knex) {
    return knex.schema
    .alterTable('master_kloter', table => {
        table.dropColumn('nama_kloter');
    });
};
