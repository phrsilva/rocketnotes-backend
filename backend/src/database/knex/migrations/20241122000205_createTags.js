exports.up = knex => knex.schema.createTable('tags', table => {
    table.increments('id')
    table.text('name').notNullable()
    table.integer('user_id').references('id').inTable('users').notNullable()
    table.text('note_id').references('id').inTable('notes').notNullable().onDelete('CASCADE')
})

exports.down = knex => knex.schema.dropTable('tags')