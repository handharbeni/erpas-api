
exports.up = function(knex) {
    return knex.schema.createTable('tools', function (t) {
        t.increments('id').unsigned().primary();
        t.string('name').notNull();
        t.string('value').notNull();
    });
};

exports.down = function(knex) {
    let dropQuery = `DROP TABLE tools`
    return knex.raw(dropQuery)  
};
