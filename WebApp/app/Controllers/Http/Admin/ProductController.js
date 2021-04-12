'use strict';
const Database = use('Database');
const { validate } = use('Validator')

const code_generator = use('voucher-code-generator');

class ProductController {

    async index ({ request, auth, response, view }){
      
      let productData = await Database.table('course_categories');

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

      return response.send(view.render('admin.product.list',{ 
        // products
      }))
    }

    async getProductCode({ request, auth, response, view }){

      const {page, code, released_day, used_day, user, status, course_id} = request.all();
    
      let productCode = Database.table('codes')
      .leftJoin('product_code', 'product_code.code_id', 'codes.id')
      .leftJoin('courses', 'courses.id', 'product_code.product_id')
      .leftJoin('users', 'product_code.user_id', 'users.id')
      .select('codes.*', 'users.username')
      
      if (code) {
        productCode.where('codes.code', code)
      }

      if (course_id && course_id != -1) {
        productCode.where('product_code.product_id', course_id)
      }
      
      if (released_day) {
        productCode.where('codes.created_at', '>=', released_day + " 00:00:00")
        productCode.where('codes.created_at', '<=', released_day + " 23:59:59")
      }
      
      if (used_day) {
        productCode.where('codes.used_at', '>=', used_day + " 00:00:00")
        productCode.where('codes.used_at', '<=', used_day + " 23:59:59")
      }

      if (user) {
        productCode.where('users.username', user)
      }

      if (status) {
        switch (status) {
          case 1:
              productCode.whereNotNull('users.used_at')
            break;
          case 2:
              productCode.whereNull('users.used_at')
            break;
          case 2:
              productCode.whereNull('users.used_at')
            break;
          case 2:
              productCode.where('users.used_at', '<', this.getDateTimeBefore(365))
            break;
          default:
            break;
        }
      }

      productCode = await productCode.paginate(page, 30)

      return response.json({
        code: 1,
        message: '',
        data: productCode
      })
    }

    getDateTimeBefore(beforeDay) {
      let date = new Date();
      date.setDate(date.getDate() - beforeDay);
      let year = date.getFullYear();
      let month = ("0" + (date.getMonth() + 1)).slice(-2);
      let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
      let hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
      let minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
      let seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();

      let fullDateTime = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
      return fullDateTime;
    }

    async generatorCode({ request, auth, response }){
        const { productid } = request.all();
        if( productid ) {
            let generated = false;
            do {
                let code = code_generator.generate({
                    // length: 8,
                    count: 1,
                    charset: "0123456789",
                    pattern: "###-####-###",
                });

                code = code[0].toUpperCase();

                const codeCheck = await Database.table('codes')
                    .where('code', code)
                    .first();

                if( !codeCheck){
                    generated = true;
                    return response.send({
                        code: 1,
                        msg: '',
                        data: code
                    });
                }
            } while (!generated);
        } else {
            return response.send({
                code: 0,
                msg: 'Thiếu mã sản phẩm',
                data: ''
            });
        }
    }

    getDateTimeBefore(beforeDay) {
      let date = new Date();
      date.setDate(date.getDate() + beforeDay);
      let year = date.getFullYear();
      let month = ("0" + (date.getMonth() + 1)).slice(-2);
      let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
      let hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
      let minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
      let seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();

      let fullDateTime = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
      return fullDateTime;
    }

  async createCode({ request, auth, response }){
    const { course_id, amount } = request.all();

    const rules = {
      course_id: 'required',
      amount: 'required'
    }

    const validation = await validate(request.all(), rules)

    if( !validation.fails() ) {
      let code_array = [];
      for (let i = 0; i < parseInt(amount); i++) {
        let generated = false;
        do {
          let code = code_generator.generate({
            // length: 8,
            count: 1,
            charset: "0123456789",
            pattern: "###-####-###",
          });

          code = code[0].toUpperCase();

          const codeCheck = await Database.table('codes')
            .where('code', code)
            .first();

          if( !codeCheck ){
            generated = true;

            const codeCreated = await Database.table('codes').insert({
              "code": code,
              "status": 1,
              "created_at":Database.fn.now(),
              "updated_at":Database.fn.now(),
            });

            for (let index = 0; index < course_id.length; index++) {
              const element = course_id[index];
              await Database.table('product_code').insert({
                "code_id": codeCreated[0],
                "product_id": element,
                "created_at":Database.fn.now(),
                "updated_at":Database.fn.now(),
              });
            }

            code_array.push(code);
          }
        } while (!generated);

      }

      return response.send({
        code: 1,
        msg: '',
        data: code_array
      });
    } else {
      return response.send({
        code: 0,
        msg: validation.messages(),
        data: ''
      });
    }
  }


    async applyCodeProduct({ request, auth, response }){
        const { productid, code } = request.all();
        if( productid && code ) {

            let productCodeCheck = await Database.table('codes')
                .where('code', code)
                .where('product_id', productid)
                .first();

            if(!productCodeCheck){
                await Database.table('codes').insert({
                    "code": code,
                    "product_id": productid,
                    "status": 1,
                    "created_at":Database.fn.now(),
                    "updated_at":Database.fn.now(),
                });

                return response.send({
                    code: 1,
                    msg: '',
                    data: ''
                });
            }else{
                return response.send({
                    code: 0,
                    msg: 'Mã đã được sử dụng',
                    data: ''
                });
            }

        } else {
            return response.send({
                code: 0,
                msg: 'Thiếu dữ liệu',
                data: ''
            });
        }
    }
}

module.exports = ProductController
