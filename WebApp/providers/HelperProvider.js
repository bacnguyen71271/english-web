'use strict'

const { ServiceProvider } = require("@adonisjs/fold")

class HelperProvider extends ServiceProvider {
    /**
     * Register namespaces to the IoC container
     *
     * @method register
     *
     * @return {void}
     */
    register () {
        this.app.singleton('ESING/Helper', () => {
            const Config = this.app.use('Adonis/Src/Config');
            const Database = require('./Helper');
            return new Database(Config);
        })
    }

    /**
     * Attach context getter when all providers have
     * been registered
     *
     * @method boot
     *
     * @return {void}
     */
    boot () {
        //
    }
}

module.exports = HelperProvider
