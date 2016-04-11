
exports.up = function(knex, Promise) {
    return knex.schema.createTable('items', function(table){
        table.increments();
        table.string('name');
        table.text('description');
        table.float('price');
        table.string('image_url');
        table.boolean('active').defaultTo(true);
    })

    .createTable('users_items', function(table){
        table.integer('user_id').references('users.id').onUpdate('CASCADE').onDelete('CASCADE');
        table.integer('items_id').references('items.id').onUpdate('CASCADE').onDelete('CASCADE');
    })

};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('items')
        .dropTable('items');

};
