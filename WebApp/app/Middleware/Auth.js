'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */

/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class Auth {
    /**
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Function} next
     */
    async handle({request, response, auth }, next) {
        try {
            await auth.check();
            await next()
        } catch (error) {
            return response.redirect('/dang-nhap')
        }
    }
}

module.exports = Auth;
