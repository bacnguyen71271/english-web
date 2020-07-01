'use strict';
const Database = use('Database');
const User = use('App/Models/User');
const { validate } = use('Validator');

class AuthController {
    async register ({ auth, request, response }) {
        const { username, password, repassword, productcode } = request.all();
        let error = '';

        if(username && productcode && password && repassword ){
            if(password !== repassword){
                error = 'Mật khẩu không trùng nhau';
            }else{
                if(password.length < 8){
                    error = 'Mật khẩu phải có ít nhất 8 ký tự';
                }else{
                    let checkUnique = await Database.table('users').where('username',username);
                    if(checkUnique.length){
                        error = 'Tài khoản này đã được sử dụng';
                    }
                }
            }
        }else{
            error = 'Hãy nhập những mục bắt buộc';
        }

        if(error === ''){
            await User.create({ username, password});
            await auth.attempt(username, password);
            response.send({
                code: 1,
                msg: 'success',
                data: ''
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
        let error = '';

        console.log(email + ':' + password);
        if(email && password){
            try{
                await auth.attempt(email, password);

                return response.send({
                    code: 1,
                    msg: "Thành công !",
                })
            }catch (e) {
                if(e.message.indexOf('E_PASSWORD_MISMATCH') !== -1){
                    error = "Mật khẩu không đúng";
                }

                if(e.message.indexOf('E_USER_NOT_FOUND') !== -1){
                    error = "Không tìm thấy tài khoản";
                }
            }
        }else{
            error = "Hãy điền tên đăng nhập và mật khẩu";
        }

        if(error !== ''){
            return response.send({
                code: 0,
                msg: error,
            })
        }
    }

    async logout ({ auth, request, response }) {
        try {
            await auth.logout();
            return response.redirect('/')
        }catch (e) {
            return response.redirect('/')
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
