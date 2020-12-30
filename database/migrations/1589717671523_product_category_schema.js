'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProductCategorySchema extends Schema {
  up () {
    this.create('product_categories', (table) => {
      table.increments();
      table.string('title',200).notNullable();
      table.integer('parent_id').defaultTo(0);
      table.boolean('status').defaultTo(true);
      table.timestamps(true,true);
    })
  }

  down () {
    this.drop('product_categories')
  }
}

module.exports = ProductCategorySchema
