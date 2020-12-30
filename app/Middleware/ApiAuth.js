'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const Database = use('Database');

class ApiAuth {
    /**
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Function} next
     */
    async handle({request, response, auth}, next) {
        // call next to advance the request
        let error = '';
        try {
            const apiToken = auth.getAuthHeader();
            let blackList = await Database.table('black_list_tokens').where('token', apiToken);
            if (blackList.length === 0) {
                await auth.check();
                await next()
            } else {
                response.send({
                    code: 0,
                    msg: 'Token hết hạn',
                    data: ''
                });
            }
        } catch (e) {
            response.send({
                code: 0,
                msg: e.message,
                data: ''
            });
        }

    }
}

module.exports = ApiAuth
