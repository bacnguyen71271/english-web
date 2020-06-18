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


Route.get('/login', ({ view }) => {return view.render('page.login')});
Route.post('/login', 'AuthController.login');

Route.group(() => {
    Route.on('/').render('admin.index');
    Route.on('/product-category').render('admin.product-category');

}).prefix('admin').middleware('auth');//.middleware(['admin']);


Route.group(() => {
    Route.post('auth/register', 'AuthController.register').middleware('guest');
    Route.post('auth/login', 'AuthController.login').middleware('guest');
    Route.post('auth/logout', 'AuthController.logout').middleware('apiAuth');

    Route.get('users/info', 'UserController.getUserInfo').middleware(['apiAuth']);
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
