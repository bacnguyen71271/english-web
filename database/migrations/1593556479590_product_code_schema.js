'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProductCodeSchema extends Schema {
  up () {
    this.create('product_codes', (table) => {
      table.increments();
      table.string('code',15).unique();
      table.integer('product-id').defaultTo(0);
      table.integer('status');
      table.timestamp('used_at');
      table.timestamp('release_at');
      table.timestamps();
    })
  }

  down () {
    this.drop('product_codes')
  }
}

module.exports = ProductCodeSchema
