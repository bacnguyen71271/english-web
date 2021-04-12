'use strict'
const Database = use('Database');

class MenuController {

    async getMenu ({request, response, view}) {
        const { id } = request.all()
        let menu = Database.table('menu')
        if (id) {
            menu.where('id', id)
            .first()
        }

        menu = await menu
        
        return response.json({
            code: 1,
            message: '',
            data: menu
        })
    }

    async add ({request, response, view}) {
        
        let { title, location, status, data} = request.all()

        let menu = await Database.table('menu')
        .insert({
            title,
            location,
            status: status ? 1 : 0,
            data: JSON.stringify(data)
        })

        return response.json({
            code: 1,
            message: '',
            data: menu[0]
        })
    }

    async update ({request, response, view}) {
        
        let { id, title, location, status, data} = request.all()

        let menu = await Database.table('menu')
        .where('id', id)
        .update({
            title,
            location,
            status: status ? 1 : 0,
            data: JSON.stringify(data)
        })

        return response.json({
            code: 1,
            message: '',
            data: menu[0]
        })
    }

    async delete ({request, response}) {
        
        let { id } = request.all()

        let menu = await Database.table('menu')
        .where('id', id)
        .delete()

        return response.json({
            code: 1,
            message: '',
            data: menu[0]
        })
    }
}

module.exports = MenuController
