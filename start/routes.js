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
Route.get('/esing-unso', ({ view }) => {return view.render('page.esing-unso')});
Route.get('/lien-he', ({ view }) => {return view.render('page.contact')});
Route.get('/quen-mat-khau', ({ view }) => {return view.render('page.forgot-password')});
Route.get('/dang-nhap', ({ view }) => {return view.render('page.dang-nhap')}).middleware('only_guest');
Route.get('/dang-ky', ({ view }) => {return view.render('page.dang-ky')}).middleware('only_guest');
Route.get('/dang-xuat', 'AuthController.logout').middleware('auth');

Route.post('/login', 'AuthController.login');

Route.group(() => {
    Route.on('/').render('admin.index');
    Route.on('/product-category').render('admin.product-category');

    Route.get('/product/code', 'ProductController.viewProductCode');

}).prefix('admin').middleware('admin');//.middleware(['admin']);


Route.group(() => {
    Route.post('auth/register', 'AuthController.register');
    Route.post('auth/login', 'AuthController.login').middleware('guest');
    Route.post('auth/logout', 'AuthController.logout').middleware('apiAuth');

    Route.get('users/info', 'UserController.getUserInfo').middleware(['apiAuth']);

    Route.post('generator-code', 'ProductController.generatorCode').middleware('admin');
    Route.post('apply-code', 'ProductController.applyCodeProduct').middleware('admin');
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
