
exports.up = function(knex) {
    return knex.schema.createTable('master_voucher', function (t) {
        t.increments('id').unsigned().primary();
        t.integer('type_voucher').notNull();
        t.integer('id_store').notNull();
        t.integer('value');
        t.string('percentage');
        t.integer('item');
        t.string('list_item');
        t.timestamp('date_expired');
        t.integer('max_used');
    });
};

exports.down = function(knex) {
    let dropQuery = `DROP TABLE master_voucher`
    return knex.raw(dropQuery)
};
