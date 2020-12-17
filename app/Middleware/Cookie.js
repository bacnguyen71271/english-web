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


        let url = domain + request.url();
        let product = -1;
        if(url.indexOf(domain + '/tieng-anh-mam-non/tuoi-34') != -1){
          product = 1;
        }

        if(url.indexOf(domain + '/tieng-anh-mam-non/tuoi-45') != -1){
          product = 2;
        }

        if(url.indexOf(domain + '/tieng-anh-mam-non/tuoi-56') != -1){
          product = 3;
        }

        if(url.indexOf(domain + '/giao-vien/tieng-anh-mam-non/tuoi-34') != -1){
          product = 4;
        }

        if(url.indexOf(domain + '/giao-vien/tieng-anh-mam-non/tuoi-45') != -1){
          product = 5;
        }

        if(url.indexOf(domain + '/giao-vien/tieng-anh-mam-non/tuoi-56') != -1){
          product = 6;
        }

        if(product != -1){
          if (!request.auth) {
            return response.redirect('/dang-nhap')
          }

          let checkUser;
          if (url.indexOf('enc.key') !== -1) {
            checkUser = await Database.table('product_codes')
              .where('userid', request.auth.userid);
          } else {
            checkUser = await Database.table('product_codes')
              .where('userid', request.auth.userid)
              .where('product_id', product);
          }

          if (checkUser.length == 0) {
            return response.redirect('/')
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
    // call next to advance the request
    await next()
  }
}

module.exports = Admin
