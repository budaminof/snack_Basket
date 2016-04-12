
exports.up = function(knex, Promise) {
    return knex.schema.table('users', function (table){
        table.string('oauth_type');
    })

};

exports.down = function(knex, Promise) {
    return knex.schema.dropCulumn('oauth_type');

};
