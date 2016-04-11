
exports.up = function(knex, Promise) {
    return knex.schema.createTable('addresses', function(table){
        table.increments();
        table.string('street1');
        table.string('street2');
        table.string('city');
        table.string('state');
        table.integer('zipcode');
    })
    .createTable('address_type', function (table){
        table.increments();
        table.string('name');
    })

    .createTable('user_addresses', function (table){
        table.integer('user_id').references('users.id').onUpdate('CASCADE').onDelete('CASCADE');
        table.integer('address_type_id').references('address_type.id').onUpdate('CASCADE').onDelete('CASCADE');
        table.integer('address_id').references('addresses.id').onUpdate('CASCADE').onDelete('CASCADE');
    })

};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('addresses')
        .dropTable('address_type')
        .dropTable('user_addresses');
};
