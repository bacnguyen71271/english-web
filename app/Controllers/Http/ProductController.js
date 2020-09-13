'use strict';
const Database = use('Database');
const { validate } = use('Validator')

const code_generator = use('voucher-code-generator');

class ProductController {

    async viewProductCode({ request, auth, response, view }){

        let productCode = await Database.table('product_codes');
        return response.send(view.render('admin.product-code',{
            productcode: productCode
        }))
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

                const codeCheck = await Database.table('product_codes')
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

  async createCode({ request, auth, response }){
    const { productid, amount } = request.all();

    const rules = {
      productid: 'required',
      amount: 'required'
    }

    const validation = await validate(request.all(), rules)

    if( !validation.fails() ) {
      let code_array = [];
      for (let i = 0; i < amount; i++) {
        let generated = false;
        do {
          let code = code_generator.generate({
            // length: 8,
            count: 1,
            charset: "0123456789",
            pattern: "###-####-###",
          });

          code = code[0].toUpperCase();

          const codeCheck = await Database.table('product_codes')
            .where('code', code)
            .first();

          if( !codeCheck ){
            generated = true;

            await Database.table('product_codes').insert({
              "code": code,
              "product_id": productid,
              "status": 1,
              "created_at":Database.fn.now(),
              "updated_at":Database.fn.now(),
            });

            code_array.push(code);

            return response.send({
              code: 1,
              msg: '',
              data: code_array
            });
          }
        } while (!generated);

      }

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

            let productCodeCheck = await Database.table('product_codes')
                .where('code', code)
                .where('product_id', productid)
                .first();

            if(!productCodeCheck){
                await Database.table('product_codes').insert({
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
