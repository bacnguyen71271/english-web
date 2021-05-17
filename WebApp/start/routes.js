'use strict'
const Helpers = use('Helpers');

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
Route.get('/dang-xuat', 'AuthController.logout');//.middleware('auth');

Route.get('/check-login', 'AuthController.checkLogin');

Route.post('/login', 'AuthController.login');

Route.group(() => {
    Route.on('/').render('admin.index');
    
    Route.get('/product/category', 'Admin/CategoryController.index');
    Route.get('/product', 'Admin/ProductController.index');

    Route.get('/shop/category', 'Admin/ShopController.category');
    Route.get('/shop', 'Admin/ShopController.listView');
    Route.get('/shop/add', 'Admin/ShopController.addProductView');

    Route.get('/product/code', 'Admin/ProductController.viewProductCode');


}).prefix('admin').middleware('admin');


Route.group(() => {

  Route.get('/home/category-and-course', 'HomeController.getCategoryAndCourse');
  Route.get('/home/course', 'HomeController.getCourse');
  Route.get('/home/menu', 'HomeController.getMenu');
  Route.get('/home/lesson', 'HomeController.getLesson');

  Route.get('/course/category', 'Admin/CourseController.getCategory');
  Route.get('/course/category/:id', 'Admin/CourseController.getCategoryById');

  Route.post('auth/register', 'AuthController.register');
  Route.post('auth/login', 'AuthController.login')
  Route.post('auth/logout', 'AuthController.logout').middleware('apiAuth');
  Route.get('auth/get-info', 'AuthController.check')

  Route.get('users/info', 'UserController.getUserInfo').middleware(['apiAuth']);
  Route.post('admin/users/change-password', 'Admin/UserController.changePassword').middleware(['apiAuth']);
  
  Route.get('/setting', 'Admin/SettingController.getSetting')

}).prefix('api/v1');

Route.group(() => {
  Route.post('auth/login', 'AuthController.login')
  Route.get('auth/get-info', 'AuthController.check')
}).prefix('adapi/v1')

Route.group(() => {

  Route.get('/course/category', 'Admin/CourseController.getCategory').middleware('pms:course-category-view');
  Route.get('/course/category/:id', 'Admin/CourseController.getCategoryById').middleware('pms:course-category-view');
  Route.delete('/course/category', 'Admin/CourseController.deleteCategory').middleware('pms:course-category-delete');
  Route.put('/course/category', 'Admin/CourseController.updateCategory').middleware('pms:course-category-add');
  Route.post('/course/category', 'Admin/CourseController.addCategory').middleware('pms:course-category-edit');

  Route.post('/course', 'Admin/CourseController.addCourse').middleware('pms:course-list-add');
  Route.put('/course', 'Admin/CourseController.editCourse').middleware('pms:course-list-edit');
  Route.get('/course', 'Admin/CourseController.getCourse').middleware('pms:course-list-view');
  Route.delete('/course', 'Admin/CourseController.deleteCourse').middleware('pms:course-list-delete');

  Route.post('/lesson', 'Admin/CourseController.addLesson').middleware('pms:lesson-add');
  Route.put('/lesson', 'Admin/CourseController.editLesson').middleware('pms:lesson-edit');
  Route.get('/lesson', 'Admin/CourseController.getLesson').middleware('pms:lesson-view');
  Route.get('/lesson/:id', 'Admin/CourseController.getLessonById').middleware('pms:lesson-view');
  Route.delete('/lesson', 'Admin/CourseController.deleteLesson').middleware('pms:lesson-delete');

  Route.get('/get-media-type', 'UploadController.getMediaType').middleware(['pms:media-view']);
  Route.get('/get-media', 'UploadController.getMedia').middleware(['pms:media-view']);
  Route.post('/media-rename', 'UploadController.mediaRename').middleware(['pms:media-edit']);
  Route.post('/upload', 'UploadController.uploads').middleware(['pms:media-add']);
  Route.post('/delete-media', 'UploadController.deleteMedia').middleware(['pms:media-delete']);

  Route.post('/shop', 'Admin/ShopController.addProduct').middleware('pms:dashboard-login');

  Route.get('/menu', 'Admin/MenuController.getMenu').middleware('pms:menu-view');
  Route.post('/menu', 'Admin/MenuController.add').middleware('pms:menu-add');
  Route.put('/menu', 'Admin/MenuController.update').middleware('pms:menu-edit');
  Route.delete('/menu', 'Admin/MenuController.delete').middleware('pms:menu-delete');

  Route.put('/setting', 'Admin/SettingController.setSetting').middleware('pms:setting-edit');
  Route.get('/setting', 'Admin/SettingController.getSetting')
  
  Route.get('product/get-product-code', 'Admin/ProductController.getProductCode').middleware('pms:dashboard-login');
  Route.post('product/create-product-code', 'Admin/ProductController.createCode').middleware('pms:dashboard-login');

  Route.get('users/info', 'UserController.getUserInfo').middleware(['pms:dashboard-login']);
  Route.post('admin/users/change-password', 'Admin/UserController.changePassword').middleware(['pms:dashboard-login']);

  Route.post('generator-code', 'ProductController.generatorCode').middleware('pms:dashboard-login');
  Route.post('apply-code', 'ProductController.applyCodeProduct').middleware('pms:dashboard-login');

  Route.get('/users', 'Admin/UserController.listUser').middleware('pms:user-list-view');
  Route.post('auth/create-user', 'AuthController.createUser').middleware('pms:user-list-add');
  Route.post('auth/update-user', 'AuthController.updateUser').middleware('pms:user-list-edit');

  Route.post('/auth/create-role', 'Admin/UserController.createRole').middleware('pms:permission-add');
  Route.post('/auth/user-get-list', 'Admin/UserController.getUserListRole').middleware('pms:permission-view');
  Route.post('/auth/role-get-list', 'Admin/UserController.getRole').middleware('pms:permission-view');
  Route.post('/auth/role-add-user', 'Admin/UserController.addUserToRole').middleware('pms:permission-add');
  Route.post('/auth/role-delete-user', 'Admin/UserController.deleteUserRole').middleware('pms:permission-delete');
  Route.post('/auth/role-delete', 'Admin/UserController.deleteRole').middleware('pms:permission-delete');
  Route.post('/auth/permission-update', 'Admin/UserController.permissionUpdate').middleware('pms:permission-edit');
  Route.post('/auth/permission-get', 'Admin/UserController.getPermission').middleware('pms:permission-view');

}).prefix('adapi/v1').middleware(['pms:dashboard-login']);

// Route.get('/tieng-anh-mam-non', ({ view }) => {return view.render('page.mamnon.index')});
// Route.on('/tieng-anh-chau-au').render('page.tieng-anh-chau-au.index');

// Route.group(() => {

//     Route.on('/').render('page.mamnon.index');
//     Route.on('/tuoi-34').render('page.mamnon.tuoi34');
//     Route.on('/tuoi-45').render('page.mamnon.tuoi45');
//     Route.on('/tuoi-56').render('page.mamnon.tuoi56');

//     Route.on('/tuoi-34/chu-de-co-the').render('page.mamnon.tuoi34.cothe');
//     Route.on('/tuoi-34/chu-de-trang-phuc').render('page.mamnon.tuoi34.topic-trangphuc');
//     Route.on('/tuoi-34/chu-de-mau-sac').render('page.mamnon.tuoi34.topic-mausac');
//     Route.on('/tuoi-34/chu-de-hoa-qua').render('page.mamnon.tuoi34.topic-hoaqua');
//     Route.on('/tuoi-34/chu-de-gia-dinh').render('page.mamnon.tuoi34.topic-giadinh');
//     Route.on('/tuoi-34/chu-de-phong-ngu').render('page.mamnon.tuoi34.topic-phongngu');
//     Route.on('/tuoi-34/chu-de-phong-tam').render('page.mamnon.tuoi34.topic-phongtam');
//     Route.on('/tuoi-34/chu-de-phong-bep').render('page.mamnon.tuoi34.topic-phongbep');
//     Route.on('/tuoi-34/chu-de-phong-khach').render('page.mamnon.tuoi34.topic-phongkhach');


//     Route.on('/tuoi-45/chu-de-cong-vien').render('page.mamnon.tuoi45.topic-congvien');
//     Route.on('/tuoi-45/chu-de-duong-pho').render('page.mamnon.tuoi45.topic-duongpho');
//     Route.on('/tuoi-45/chu-de-nha-va-vuon').render('page.mamnon.tuoi45.topic-nhavuon');
//     Route.on('/tuoi-45/chu-de-phuong-tien-giao-thong').render('page.mamnon.tuoi45.topic-ptgt');
//     Route.on('/tuoi-45/chu-de-thien-nhien').render('page.mamnon.tuoi45.topic-thiennhien');
//     Route.on('/tuoi-45/chu-de-thu-cung').render('page.mamnon.tuoi45.topic-thucung');
//     Route.on('/tuoi-45/chu-de-trang-trai').render('page.mamnon.tuoi45.topic-trangtrai');
//     Route.on('/tuoi-45/chu-de-tro-choi').render('page.mamnon.tuoi45.topic-trochoi');
//     Route.on('/tuoi-45/chu-de-truong-hoc').render('page.mamnon.tuoi45.topic-truonghoc');


//     Route.on('/tuoi-56/chu-de-doi-thoai').render('page.mamnon.tuoi56.topic-doithoai');
//     Route.on('/tuoi-56/chu-de-nghe-nghiep').render('page.mamnon.tuoi56.topic-nghenghiep');
//     Route.on('/tuoi-56/chu-de-hoat-dong').render('page.mamnon.tuoi56.topic-hoatdong');
//     Route.on('/tuoi-56/chu-de-di-sieu-thi').render('page.mamnon.tuoi56.topic-disieuthi');
//     Route.on('/tuoi-56/chu-de-buatiec').render('page.mamnon.tuoi56.topic-buatiec');
//     Route.on('/tuoi-56/chu-de-di-mua-sam').render('page.mamnon.tuoi56.topic-dimuasam');
//     Route.on('/tuoi-56/chu-de-cong-trinh-xay-dung').render('page.mamnon.tuoi56.topic-ctxd');
//     Route.on('/tuoi-56/chu-de-cang-hang-khong').render('page.mamnon.tuoi56.topic-canghangkhong');
//     Route.on('/tuoi-56/chu-de-thoi-gian').render('page.mamnon.tuoi56.topic-thoigian');

// }).prefix('/tieng-anh-mam-non');


// Route.on('/giao-vien').render('page.giaovien.index');
// Route.group(() => {

//   Route.on('/').render('page.giaovien.mamnon.index');

//   Route.on('/tai-lieu-tham-khao').render('page.giaovien.mamnon.tailieuthamkhao.index');

//   Route.on('/tai-lieu-tham-khao/sach-giao-vien').render('page.giaovien.mamnon.tailieuthamkhao.sachgiaovien');

//   Route.on('/video-tham-khao').render('page.giaovien.mamnon.videothamkhao.index');
//   Route.on('/video-tham-khao/co-the').render('page.giaovien.mamnon.videothamkhao.co-the');
//   Route.on('/video-tham-khao/hoat-dong').render('page.giaovien.mamnon.videothamkhao.hoat-dong');

//   Route.on('/tuoi-34').render('page.giaovien.mamnon.tuoi34');
//   Route.on('/tuoi-45').render('page.giaovien.mamnon.tuoi45');
//   Route.on('/tuoi-56').render('page.giaovien.mamnon.tuoi56');

//   Route.on('/tuoi-34/video-tham-khao').render('page.giaovien.mamnon.tuoi34.videothamkhao.index');
//   Route.on('/tuoi-34/tai-lieu-tham-khao').render('page.giaovien.mamnon.tuoi34.tailieuthamkhao.index');

//   Route.on('/tuoi-34/chu-de-co-the').render('page.giaovien.mamnon.tuoi34.cothe');
//   Route.on('/tuoi-34/chu-de-trang-phuc').render('page.giaovien.mamnon.tuoi34.topic-trangphuc');
//   Route.on('/tuoi-34/chu-de-mau-sac').render('page.giaovien.mamnon.tuoi34.topic-mausac');
//   Route.on('/tuoi-34/chu-de-hoa-qua').render('page.giaovien.mamnon.tuoi34.topic-hoaqua');
//   Route.on('/tuoi-34/chu-de-gia-dinh').render('page.giaovien.mamnon.tuoi34.topic-giadinh');
//   Route.on('/tuoi-34/chu-de-phong-ngu').render('page.giaovien.mamnon.tuoi34.topic-phongngu');
//   Route.on('/tuoi-34/chu-de-phong-tam').render('page.giaovien.mamnon.tuoi34.topic-phongtam');
//   Route.on('/tuoi-34/chu-de-phong-bep').render('page.giaovien.mamnon.tuoi34.topic-phongbep');
//   Route.on('/tuoi-34/chu-de-phong-khach').render('page.giaovien.mamnon.tuoi34.topic-phongkhach');


//   Route.on('/tuoi-45/video-tham-khao').render('page.giaovien.mamnon.tuoi45.videothamkhao.index');
//   Route.on('/tuoi-45/tai-lieu-tham-khao').render('page.giaovien.mamnon.tuoi45.tailieuthamkhao.index');

//   Route.on('/tuoi-45/chu-de-cong-vien').render('page.giaovien.mamnon.tuoi45.topic-congvien');
//   Route.on('/tuoi-45/chu-de-duong-pho').render('page.giaovien.mamnon.tuoi45.topic-duongpho');
//   Route.on('/tuoi-45/chu-de-nha-va-vuon').render('page.giaovien.mamnon.tuoi45.topic-nhavuon');
//   Route.on('/tuoi-45/chu-de-phuong-tien-giao-thong').render('page.giaovien.mamnon.tuoi45.topic-ptgt');
//   Route.on('/tuoi-45/chu-de-thien-nhien').render('page.giaovien.mamnon.tuoi45.topic-thiennhien');
//   Route.on('/tuoi-45/chu-de-thu-cung').render('page.giaovien.mamnon.tuoi45.topic-thucung');
//   Route.on('/tuoi-45/chu-de-trang-trai').render('page.giaovien.mamnon.tuoi45.topic-trangtrai');
//   Route.on('/tuoi-45/chu-de-tro-choi').render('page.giaovien.mamnon.tuoi45.topic-trochoi');
//   Route.on('/tuoi-45/chu-de-truong-hoc').render('page.giaovien.mamnon.tuoi45.topic-truonghoc');


//   Route.on('/tuoi-56/video-tham-khao').render('page.giaovien.mamnon.tuoi56.videothamkhao.index');
//   Route.on('/tuoi-56/tai-lieu-tham-khao').render('page.giaovien.mamnon.tuoi56.tailieuthamkhao.index');

//   Route.on('/tuoi-56/chu-de-doi-thoai').render('page.giaovien.mamnon.tuoi56.topic-doithoai');
//   Route.on('/tuoi-56/chu-de-nghe-nghiep').render('page.giaovien.mamnon.tuoi56.topic-nghenghiep');
//   Route.on('/tuoi-56/chu-de-hoat-dong').render('page.giaovien.mamnon.tuoi56.topic-hoatdong');
//   Route.on('/tuoi-56/chu-de-di-sieu-thi').render('page.giaovien.mamnon.tuoi56.topic-disieuthi');
//   Route.on('/tuoi-56/chu-de-bua-tiec').render('page.giaovien.mamnon.tuoi56.topic-buatiec');
//   Route.on('/tuoi-56/chu-de-di-mua-sam').render('page.giaovien.mamnon.tuoi56.topic-dimuasam');
//   Route.on('/tuoi-56/chu-de-cong-trinh-xay-dung').render('page.giaovien.mamnon.tuoi56.topic-ctxd');
//   Route.on('/tuoi-56/chu-de-cang-hang-khong').render('page.giaovien.mamnon.tuoi56.topic-canghangkhong');
//   Route.on('/tuoi-56/chu-de-thoi-gian').render('page.giaovien.mamnon.tuoi56.topic-thoigian');

// }).prefix('/giao-vien/tieng-anh-mam-non');

// Route.get('/enc.key',async ({ response }) => {
//   return response.download(Helpers.publicPath('key/enc.key'))
// }).middleware('uproduct');


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
Route.post('/logout', 'UserController.logout');
