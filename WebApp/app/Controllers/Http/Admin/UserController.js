'use strict'
const Database = use('Database');
const Hash = use('Hash')

class UserController {

    async getPermission ({request, response}) {
        const { role_id } = request.all()

        const listPermistion = await Database.table('rbac_item_child')
        .where('parent', role_id)
        .select('child')

        return response.json({
            code: 1,
            message: '',
            data: listPermistion
        })
    }

    async permissionUpdate ({request, response}) {
        let { permistion, role_id } = request.all();

        if (permistion && role_id) {
            // delete all permission
            await Database.table('rbac_item_child')
            .where('parent', role_id)
            .delete();

            let query = '';

            Object.keys(permistion).forEach( async function(key) {
                if (permistion[key]) {
                    await Database.table('rbac_item_child')
                    .insert({
                        child: key,
                        parent: role_id
                    })
                }
            })

            return response.json({
                code: 1,
                message: 'Thành công',
            })
        }

        return response.json({
            code: 0,
            message: 'Không thành công',
        })
    }

    async deleteRole ({request, response}) {
        const { role_id } = request.all()

        if (role_id) {

            await Database.table('rbac_assignment')
            .where('item_id', role_id)
            .delete()

            await Database.table('rbac_item')
            .where('id', role_id)
            .delete()
            
            await Database.table('rbac_item_child')
            .where('parent', role_id)
            .delete()

            return response.json({
                code: 1,
                message: 'Thành công'
            })
        }

        return response.json({
            code: 0,
            message: 'Không thành công'
        })
    }

    async deleteUserRole ({request, response}) {
        const { user_id, role_id } = request.all()

        if (user_id && role_id) {
            await Database.table('rbac_assignment')
            .where('user_id', user_id)
            .where('item_id', role_id)
            .delete()

            return response.json({
                code: 1,
                message: 'Thành công'
            })
        }

        return response.json({
            code: 0,
            message: 'Không thành công'
        })
    }

    async addUserToRole ({request, response}) {
        const { user_id, role_id } = request.all()
        let error = ''
        // Check user 
        const checkUser = await Database.table('users')
        .where('user_id', user_id)
        .first()

        if (checkUser) {
            // Check user in role
            const checkRole = await Database.table('rbac_assignment')
            .where('user_id', user_id)
            .where('item_id', role_id)
            .first()

            if (!checkRole) {
                await Database.table('rbac_assignment')
                .insert({
                    user_id: user_id,
                    item_id: role_id
                })

                return response.json({
                    code: 1,
                    message: 'Thành công',
                })

            } else {
                error = 'User đã có vai trò này'
            }

        } else {
            error = 'Không tìm thấy user này'
        }

        return response.json({
            code: 0,
            message: error,
        })
    }

    async getRole ({request, response}) {
        try {
            const listRole = await Database.table('rbac_item')
    
            return response.json({
                code: 1,
                message: '',
                data: listRole
            })
        } catch (error) {
            return response.json({
                code: 0,
                message: error.message,
            })
        }
    }

    async getUserListRole ({request, response}) {
        const { role_id } = request.all()

        if (role_id) {
            const listUser = await Database.table('rbac_assignment')
            .join('users', 'users.id', 'rbac_assignment.user_id')
            .where('item_id', role_id)
            .select('users.id', 'users.email', 'users.fullname')

            return response.json({
                code: 1,
                message: '',
                data: listUser
            })
        }

        return response.json({
            code: 0,
            message: '',
        })
    }

    async createRole ({request, response}) {
        const { role_name, role_description } = request.all()

        if (role_name && role_name != '') {
            try {
                // Check role name
                const checkRole = await Database.table('rbac_item')
                .where('name', role_name)
                .first()

                if (!checkRole) {
                    const role = await Database.table('rbac_item')
                    .insert({
                        name: role_name,
                        description: role_description
                    })

                    return response.json({
                        code: 1,
                        message: 'Thành công',
                        data: {
                            id: role[0],
                            name: role_name
                        }
                    })
                } else {
                    return response.json({
                        code: 0,
                        message: 'Role này đã tồn tại'
                    })
                }
                
            } catch (error) {
                console.log(error.message)
            }
        }

        return response.json({
            code: 0,
            message: 'Không thành công'
        })
    }

    async listUser ({ request, auth, response, view }) {
        const { page, username, to_date, from_date } = request.all()
        let users = Database.table('users')
        .orderBy('id', 'desc')

        if (username) {
            users.where('username', username)
        }

        if (to_date) {
            users.where('created_at', '>=', to_date + ' 00:00:00')
        }

        if (from_date) {
            users.where('created_at', '<=', from_date + ' 23:59:59')
        }
        
        users = await users.paginate(page, 30)

        return response.json({
            code: 1,
            message: 'success',
            data: users
        })
    }

    async changePassword ({ request, response }) {
        const { id, new_pass } = request.all()

        const safePassword = await Hash.make(new_pass)

        await Database.table('users')
        .where('id', id)
        .update({
            'password': safePassword,
        })
        return response.json({
            code: 1,
            message: 'success',
        })
    }
}

module.exports = UserController
