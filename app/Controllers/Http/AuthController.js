'use strict';
const Database = use('Database');
const User = use('App/Models/User');
const { validate } = use('Validator');

class AuthController {


    async register ({ auth, request, response }) {
        const { username, email, phone,password, repassword } = request.all();
        let error = '';

        if(username && email && phone && password && repassword ){
            if(password !== repassword){
                error = 'Mật khẩu không trùng nhau';
            }else{
                if(password.length < 8){
                    error = 'Mật khẩu phải có ít nhất 8 ký tự';
                }else{
                    let checkUnique = await Database.table('users').where('email',email);
                    if(checkUnique.length){
                        error = 'Email này đã được sử dụng';
                    }
                }
            }
        }else{
            error = 'Thiếu dữ liệu: username, email, phone, password, repassword';
        }

        if(error === ''){
            const user = await User.create({ username, email, password, phone});
            const token = await auth.attempt(email, password);
            response.send({
                code: 1,
                msg: 'success',
                data: token
            });
        }else{
            response.send({
                code: 0,
                msg: error,
                data: ''
            });
        }
    }

    async login ({ auth, session, request, response }) {
        const { email, password, remember } = request.all();

        if(email && password){
            try{
                const token = await auth.attempt(email, password);
            }catch (e) {
                if(e.message.indexOf('E_PASSWORD_MISMATCH') !== -1){
                    session.withErrors({ notification: 'Mật khẩu không đúng' }).flashAll();
                }

                if(e.message.indexOf('E_USER_NOT_FOUND') !== -1){
                    session.withErrors({ notification: 'Không tìm thấy tài khoản' }).flashAll();
                }
            }
        }else{
            session.withErrors({ notification: 'Thiếu dữ liệu: email, password' }).flashAll();
        }
        session.flashAll();
        return response.redirect('back')
    }

    async logout ({ auth, request, response }) {
        try {
            const apiToken = auth.getAuthHeader()
            // let listToken = await auth.listTokens();
            await auth
                .authenticator('jwt')
                .revokeTokens([apiToken]);
            // revokeTokensForUser(user, tokens, delete = false)
            await Database.table('black_list_tokens').insert({
                token : apiToken,
                created_at : Database.fn.now(),
                updated_at : Database.fn.now()
            });
            response.send({
                code: 1,
                msg: '',
                data: ''
            });
        }catch (e) {
            response.send({
                code: 0,
                msg: e.message,
                data: ''
            });
        }
    }

    show ({ auth, params }) {
        if (auth.user.id !== Number(params.id)) {
            return "You cannot see someone else's profile"
        }
        return auth.user
    }
}

module.exports = AuthController;
