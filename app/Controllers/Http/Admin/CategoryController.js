'use strict';
const Database = use('Database');
const { validate } = use('Validator')

class CategoryController {

    async index({ request, auth, response, view }){

      let products = await Database.table('product');
        return response.send(view.render('admin.product.category',{ products }))
    }

}

module.exports = CategoryController
