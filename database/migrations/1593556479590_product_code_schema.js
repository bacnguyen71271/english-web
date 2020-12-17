'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProductCodeSchema extends Schema {
  up () {
    this.create('codes', (table) => {
      table.increments();
      table.string('code',15).unique();
      table.integer('product_id').defaultTo(0);
      table.integer('status');
      table.integer('userid');
      table.datetime('used_at');
      table.datetime('release_at');
      table.timestamps();
    })
  }

  down () {
    this.drop('codes')
  }
}

module.exports = ProductCodeSchema
