'use strict'
const Database = use('Database');

class Permission {
  async handle ({ request, auth, response }, next, properties) {
    if (properties && auth.user) {
      const check = await Database.table('rbac_assignment')
      .join('rbac_item_child', 'rbac_item_child.parent', 'rbac_assignment.item_id')
      .where('rbac_assignment.user_id', auth.user.id)
      .where('rbac_item_child.child', properties[0])
      .first();
      
      if (check) {
        await next()
      } else {
        return response.json({
          code: 2,
          message: "Bạn không có quyền"
        })
      }
    } else {
      return response.json({
        code: 2,
        message: "Bạn không có quyền"
      })
    }
  }
}

module.exports = Permission
