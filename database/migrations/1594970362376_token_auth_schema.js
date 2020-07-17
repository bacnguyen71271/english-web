'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TokenAuthSchema extends Schema {
  up () {
    this.create('token_auths', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users');
      table.string('auth_token', 300);
      table.boolean('is_revoked').defaultTo(false);
      table.string('device_info', 300).notNullable();
      table.timestamps()
    })
  }

  down () {
    this.drop('token_auths')
  }
}

module.exports = TokenAuthSchema
