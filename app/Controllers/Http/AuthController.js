'use strict';
const Database = use('Database');
const User = use('App/Models/User');
const { validate } = use('Validator');

class AuthController {

    async registerIndex ({ auth, view, request, response}) {
        try {
            await auth.check();
            return response.redirect('/');
        } catch (error) {
            return response.send(view.render('page.register'));
        }
    }

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

    async loginIndex ({ auth, view, request, response}) {
        try {
            await auth.check();
            return response.redirect('/');
        } catch (error) {
            return response.send(view.render('page.login'));
        }
    }

    async login ({ auth, request, response }) {
        const { email, password, remember } = request.all();
        await auth.remember(remember).attempt(email, password);
        response.redirect('back');
        return
    }

    async logout ({ auth, request, response }) {
        try {
            await auth.logout();
        }catch (e) {

        }
        return response.redirect('/');
    }

    show ({ auth, params }) {
        if (auth.user.id !== Number(params.id)) {
            return "You cannot see someone else's profile"
        }
        return auth.user
    }
}

module.exports = AuthController
