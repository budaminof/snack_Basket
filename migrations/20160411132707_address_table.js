
exports.up = function(knex, Promise) {
    return knex.schema.createTable('addresses', function(table){
        table.increments();
        table.string('street1');
        table.string('street2');
        table.string('city');
        table.string('state');
        table.integer('zipcode');
    })

    .createTable('users_addresses', function(table){
        table.integer('user_id').references('users.id').onUpdate('CASCADE').onDelete('CASCADE');
        table.integer('address_id').references('addresses.id').onUpdate('CASCADE').onDelete('CASCADE');
        table.string('address_type');
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('address');
};
