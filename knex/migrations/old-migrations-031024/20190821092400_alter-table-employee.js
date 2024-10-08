
exports.up = function(knex) {
    return knex.schema
    .alterTable('employee', (table) => {
        table.integer('company_id').unsigned().references('company.id');
        table.boolean('isAdminStore');
        table.boolean('isAdminCompany');
    });
};

exports.down = function(knex) {
    return knex.schema
    .alterTable('employee', table => {
        table.dropColumn('company_id');
        table.dropColumn('isAdminStore');
        table.dropColumn('isAdminCompany');
    });
};
