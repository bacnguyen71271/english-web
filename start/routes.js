'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
Route.on('/').render('page.home');
Route.on('/register').render('page.register');
Route.on('/login').render('page.login');


Route.group(() => {
    Route.post('auth/register', 'AuthController.register').middleware('guest');
    Route.post('auth/login', 'AuthController.login').middleware('guest');

    Route.get('users/info', 'UserController.register').middleware('guest');
}).prefix('api/v1');

//
// Route
//     .get('users/:id', 'UserController.show')
//     .middleware('auth')
//
// Route.on('/').render('page/home');
//
// Route.get('/login', 'UserController.loginIndex');
// Route.post('/login', 'UserController.login');
// Route.get('/register','UserController.registerIndex');
// Route.post('/register', 'UserController.register');
//
// Route.post('/logout', 'UserController.logout');
