
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users_cart', function(table){
      table.increments();
      table.integer('user_id').references('users.id').onUpdate('CASCADE').onDelete('CASCADE');
      table.integer('item_id').references('items.id').onUpdate('CASCADE').onDelete('CASCADE');
      table.boolean('paid').defaultTo('false');
  })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('users_cart');
};
