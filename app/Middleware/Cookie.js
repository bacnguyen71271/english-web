'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const uuid = require('uuid');
const Database = use('Database');
const Env = use('Env');

class Admin {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({request, response }, next) {
    const domain = Env.get('DOMAIN', 'http://127.0.0.1:3333');
    try {
      const authCookie = request.cookie('auth_cookie');
      if (!authCookie) {
        response.cookie('auth_cookie', uuid.v4(), {
          // domain: '127.0.0.1',
          path: '/',
          // httpOnly: true,
        })
      } else {
        const authInfo = await Database
          .table('token_auths')
          .join('users', 'users.id', 'token_auths.user_id')
          .where('token_auths.auth_token', authCookie)
          .where('token_auths.is_revoked', 0)
          .first();

        if (authInfo) {
          request.auth = {
            userid: authInfo.user_id,
            username: authInfo.username,
            email: authInfo.email,
            fullname: authInfo.fullname,
            phone: authInfo.phone,
          }
        } else {
          request.auth = null;
        }


        let url = request.url().replace(domain,'');
        let product = await Database.table('product')

        let productId = -1;
        for (let index = 0; index < product.length; index++) {
          const element = product[index];
          if (request.url().indexOf(element.product_link) != -1) { productId = element }
        }
        // .where('product_link', url)
        // .first();

        if (productId != -1) {
          if (!request.auth) {
            return response.redirect('/dang-nhap')
          }

          let checkUser;
          if (url.indexOf('enc.key') !== -1) {
            checkUser = await Database.table('codes')
              .where('userid', request.auth.userid);
          } else {
            checkUser = Database.table('product_code')
            .join('codes', 'product_code.code_id', 'codes.id')
            .join('product', 'product.id', 'product_code.product_id')
            .where('product_code.user_id', request.auth.userid)
            .where('product.id', productId.id)
            .where('product_code.exp_date', '>', this.getDateTimeBefore(0));

            // console.log(checkUser.toSQL());

            checkUser = await checkUser;
          }

          if (checkUser.length == 0) {
            return response.redirect('/')
          }
        }
      }
    } catch (error) {
      console.log(error);
      return response.redirect('/')
    }
    // call next to advance the request
    await next()
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
}

module.exports = Admin
