'use strict'

class UserController {
    async getUserInfo ({ request, auth, response}) {
        try {
            await auth.check();
            const user = await auth.getUser();
            response.send({
                code: 1,
                msg: '',
                data: {
                    uid: user.id,
                    email: user.email,
                    username: user.username
                }
            });
        } catch (error) {
            response.send({
                code: 0,
                msg: error.message,
                data: ''
            });
        }
    }
}

module.exports = UserController;
