'use strict'
const User = use('App/Models/User');
const { validate } = use('Validator');

class UserController {

    async registerIndex ({ auth, view, request, response}) {
        try {
            await auth.check();
            return response.redirect('/');
        } catch (error) {
            return response.send(view.render('page.register'));
        }
    }

    async register ({ auth, request, response }) {
        const rules = {
            email: 'required|email|unique:email',
            password: 'required',
            username: 'required'
        };
        const validation = await validate(request.all(), rules);
        if (validation.fails()) {
            session
                .withErrors(validation.messages())
                .flashExcept(['password'])

            return response.redirect('back')
        }

        const { username, email, phone,password } = request.all();
        const user = await User.create({ username, email, password, phone});
        // generate the jwt for the user
        await auth.attempt(email, password);
        return response.redirect('/');
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

module.exports = UserController
