'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BlackListTokenSchema extends Schema {
  up () {
    this.create('black_list_tokens', (table) => {
      table.increments();
      table.string('token', 255).notNullable().unique().index();
      table.timestamps(true,true)
    })
  }

  down () {
    this.drop('black_list_tokens')
  }
}

module.exports = BlackListTokenSchema
