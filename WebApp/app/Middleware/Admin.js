'use strict'
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

    // if( request.auth) {
    //   await next()
    // } else {
    //   return response.redirect('/dang-nhap')
    // }

    await next()
  }
}

module.exports = Admin
