
exports.up = function(knex, Promise) {
    return knex.schema.createTable('users_cart', function(table){
        table.integer('user_id').references('users.id').onUpdate('CASCADE').onDelete('CASCADE');
        table.integer('item_id').references('items.id').onUpdate('CASCADE').onDelete('CASCADE');
    })

};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('users_cart');
};
