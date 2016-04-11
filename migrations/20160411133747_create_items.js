
exports.up = function(knex, Promise) {
    return knex.schema.createTable('items', function(table){
        table.increments();
        table.string('name');
        table.text('description');
        table.float('price');
        table.boolean('active').defaultTo('true');
        table.string('image_url');
    })

};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('items');

};
