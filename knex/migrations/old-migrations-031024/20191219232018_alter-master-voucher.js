
exports.up = function(knex) {
    return knex.schema
    .alterTable('master_voucher', (table) => {
        table.string('nama_voucher');
        table.integer('used');
        table.boolean('isActive');
    });
};

exports.down = function(knex) {
    return knex.schema
    .alterTable('master_voucher', table => {
        table.dropColumn('nama_voucher');
        table.dropColumn('used');
        table.dropColumn('isActive');
    });
};
