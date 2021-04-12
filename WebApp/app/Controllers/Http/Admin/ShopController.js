'use strict'
const Database = use('Database');

class ShopController {

    async category({ request, auth, response, view }){

        let productData = await Database.table('shop_category');
  
        let products = productData.filter((pr) => { return pr.parent_id == 0 || pr.parent_id == null})
  
        // Loop productCategory level 1
        for (let index = 0; index < products.length; index++) {
          products[index].childs = productData.filter((pr) => { return pr.parent_id == products[index].id })
          // Loop productCategory level 2
          for (let index2 = 0; index2 < products[index].childs.length; index2++) {
            products[index].childs[index2].childs = productData.filter((pr) => { return pr.parent_id == products[index].childs[index2].id })
            for (let index3 = 0; index3 < products[index].childs[index2].childs.length; index3++) {
              products[index].childs[index2].childs[index3].childs = productData.filter((pr) => { return pr.parent_id == products[index].childs[index2].childs[index3].id })
            }
          }
        }
  
        return response.send(view.render('admin.shop.category',{ 
          products
        }))
    }

    async listView ({ request, auth, response, view }){

        const { page } = request.all()

        let products = await Database.table('shop_product')
        .join('shop_category', 'shop_category.id', 'shop_product.category_id')
        .select('shop_product.*', 'shop_category.title as category_title')
        .paginate(page, 30)
  
        return response.send(view.render('admin.shop.list',{ 
          products
        }))
    }

    async addProductView ({ request, response }){
        return response.send(view.render('admin.shop.list',{}))
    }


    async addProduct ({ request, response }){
        const { title, price, description, image, reduced_price, category_id, status } = request.all()

        const product = await Database.table('shop_product')
        .insert({
            title, price, description, image, reduced_price, category_id, status
        })

        return response.json({
            code: 1,
            message: '',
            data: product[0]
        })
    }

}

module.exports = ShopController
