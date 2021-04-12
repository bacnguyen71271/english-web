'use strict'
const Database = use('Database');

class SettingController {

    async getSetting ({request, response}) {
        const { key }  = request.all()
        
        if (key) {
            const setting = Database.table('settings')
            .where('meta_key', key)
            .first()
            
            if (setting) {
                return response.json({
                    code: 1,
                    data: setting.meta_data != '' ? JSON.parse(setting.meta_data) : {}
                })
            }
        }

        return response.json({
            code: 1,
            data: {}
        })
    }

    async setSetting ({request, response}) {
        const { key, data }  = request.all()
        
        if (key, data) {

            const setting = Database.table('settings')
            .where('meta_key', key)
            .update( {
                meta_data: data
            })

        }

        return response.json({
            code: 1,
            data: {}
        })
    }
}

module.exports = SettingController
