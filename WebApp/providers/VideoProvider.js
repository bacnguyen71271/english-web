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
        this.app.singleton('ESING/Video', () => {
            const Config = this.app.use('Adonis/Src/Config');
            const Database = require('./Video');
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
