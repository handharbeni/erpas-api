
exports.up = function(knex) {
    return knex.schema.createTable('m_category', function (t) {
        t.increments('id').unsigned().primary();
        t.string('nama');
    });
};

exports.down = function(knex) {
    let dropQuery = `DROP TABLE m_category`
    return knex.raw(dropQuery)
};
