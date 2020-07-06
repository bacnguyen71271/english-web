'use strict'
const Database = use('Database');
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class Admin {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({request, response, auth }, next) {
    try {
      // await auth.check();
      let user = await auth.getUser();

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

      let checkUser;
      if(url.indexOf('enc.key') !== -1){
        checkUser = await Database.table('product_codes')
            .where('userid', user.id);
      }else{
        checkUser = await Database.table('product_codes')
            .where('userid', user.id)
            .where('product_id', product);
      }

      if(checkUser.length > 0){
        await next()
      }else{
        return response.redirect('/')
      }

    } catch (error) {
      return response.redirect('/dang-nhap')
    }
    // call next to advance the request
    // await next()
  }
}

module.exports = Admin
