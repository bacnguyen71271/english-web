'use strict';
const Database = use('Database');
const { validate } = use('Validator')

const code_generator = use('voucher-code-generator');

class ProductController {

    async viewProductCode({ request, auth, response, view }){

        let productCode = await Database.table('codes');
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


    async run ({ request, auth, response }) {
      const codes = await Database.table('codes');
      for (let index = 0; index < codes.length; index++) {
        const element = codes[index];

        console.log(element.id);

        if ( element.id > 15034 && element.id < 16035) {

          if (element.userid != null) {
            await Database.table('product_code').insert({
              'product_id': 4,
              'code_id': element.id,
              'user_id' : element.userid,
              'use_date' : Database.fn.now(),
              'exp_date' : this.getDateTimeBefore(element.expiry_date)
            })

            await Database.table('product_code').insert({
              'product_id': 5,
              'code_id': element.id,
              'user_id' : element.userid,
              'use_date' : Database.fn.now(),
              'exp_date' : this.getDateTimeBefore(element.expiry_date)
            })

            await Database.table('product_code').insert({
              'product_id': 6,
              'code_id': element.id,
              'user_id' : element.userid,
              'use_date' : Database.fn.now(),
              'exp_date' : this.getDateTimeBefore(element.expiry_date)
            })
          } else {
            await Database.table('product_code').insert({
              'product_id': 4,
              'code_id': element.id,
            })

            await Database.table('product_code').insert({
              'product_id': 5,
              'code_id': element.id,
            })

            await Database.table('product_code').insert({
              'product_id': 6,
              'code_id': element.id,
            })
          }

        } else {

          let data = {
            'product_id': element.product_id,
            'code_id': element.id,
          }
          if (element.userid != null) {
            data.user_id = element.userid;
            data.use_date = Database.fn.now();
            data.exp_date = this.getDateTimeBefore(element.expiry_date);
          }

          await Database.table('product_code').insert(data)

        }

      }

      return response.send({
          code: 1,
          msg: 'OK',
          data: ''
      })
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
    const { productid, amount } = request.all();

    const rules = {
      productid: 'required',
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

            await Database.table('codes').insert({
              "code": code,
              "product_id": productid,
              "status": 1,
              "created_at":Database.fn.now(),
              "updated_at":Database.fn.now(),
            });
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
