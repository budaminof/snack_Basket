
exports.up = function(knex, Promise) {
    return knex.schema.createTable('users', function (table){
        table.increments();
        table.string('first_name');
        table.string('last_name');
        table.string('email').unique();
        table.string('password');
        table.boolean('admin').defaultTo(false);
        table.string('oauth_type');
        table.string('image_url');
    })

};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('users');

};
