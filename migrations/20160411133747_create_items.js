
exports.up = function(knex, Promise) {
    return knex.schema.createTable('items', function(table){
        table.increments();
        table.string('name');
        table.text('description');
        table.float('price');
        table.string('image_url');
        table.boolean('active').defaultTo(true);
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('items');

};
