'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const uuid = require('uuid');
const Database = use('Database');
class Admin {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({request, response }, next) {
    try {
      const authCookie = request.cookie('auth_cookie');
      if(!authCookie){
        response.cookie('auth_cookie', uuid.v4(),{
          // domain: '127.0.0.1',
          path: '/',
          // httpOnly: true,
        })
      }else{
        const authInfo = await Database
          .table('token_auths')
          .join('users','users.id','token_auths.user_id')
          .where('token_auths.auth_token',authCookie)
          .where('token_auths.is_revoked',0)
          .first();

        if(authInfo){
          request.auth = {
            userid : authInfo.user_id,
            username: authInfo.username,
            email: authInfo.email,
            fullname: authInfo.fullname,
            phone: authInfo.phone,
          }
        }else{
          c= null;
        }


        let url = request.url();
        let product = -1;
        if(url.indexOf('tieng-anh-mam-non/tuoi-34') > 0){
          product = 1;
        }

        if(url.indexOf('tieng-anh-mam-non/tuoi-45') > 0){
          product = 2;
        }

        if(url.indexOf('tieng-anh-mam-non/tuoi-56') > 0){
          product = 3;
        }

        if(product == -1){

        }else{
          if(!request.auth){
            return response.redirect('/dang-nhap')
          }

          let checkUser;
          if(url.indexOf('enc.key') !== -1){
            checkUser = await Database.table('product_codes')
              .where('userid', request.auth.userid);
          }else{
            checkUser = await Database.table('product_codes')
              .where('userid', request.auth.userid)
              .where('product_id', product);
          }

          if(checkUser.length > 0){
            await next()
          }else{
            return response.redirect('/')
          }
        }


      }
    } catch (error) {
    }

    // call next to advance the request
    await next()
  }
}

module.exports = Admin
