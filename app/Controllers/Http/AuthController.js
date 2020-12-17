'use strict';
const Database = use('Database');
const Hash = use('Hash')
const User = use('App/Models/User');
const { validate } = use('Validator');

class AuthController {
  async register({ auth, request, response }) {
    const { username, password, repassword, productcode, email, phone, fullname } = request.all();
    let error = '';

    if (username && productcode && password && repassword) {
      if (password !== repassword) {
        error = 'Mật khẩu không trùng nhau';
      } else {
        if (password.length < 8) {
          error = 'Mật khẩu phải có ít nhất 8 ký tự';
        } else {
          let checkUnique = await Database.table('users').where('username', username);
          if (checkUnique.length) {
            error = 'Tài khoản này đã được sử dụng';
          }
        }
      }
    } else {
      error = 'Hãy nhập những mục bắt buộc';
    }

    const checkCode = await Database.table('product_code')
      .join('codes', 'codes.id', 'product_code.code_id')
      .join('product', 'product.id', 'codes.product_id')
      .where('codes.code', productcode)
      .select('product_code.code_id', 'product.status', 'product.product_title', 'codes.expiry_date', 'product_code.user_id')
      .first();

    if (checkCode) {

      if (checkCode.status == 0) {
        error = 'Sản phẩm '+ checkCode.product_title +' đã ngừng. Liên hệ với nhà cung cấp !';
      } else if ( checkCode.user_id != 0 ) {
        error = 'Mã sản phẩm đã được sử dụng';
      }

    } else {
      error = 'Mã sản phẩm không tồn tại';
    }


    if (error.length == 0) {
      let user = await User.create({ username, password });
      // await auth.attempt(username, password);

      // await Database.table('product_codes')
      //   .where('id', checkCode.id)
      //   .update({
      //     'userid': user.id,
      //     'used_at': Database.fn.now()
      //   });

      if (user.id) {
        await Database.table('product_code')
        .where('code_id', checkCode.code_id)
        .update({
          'user_id': user.id,
          'use_date': Database.fn.now(),
          'exp_date': this.getDateTimeBefore(checkCode.expiry_date)
        })

        await Database.table('users')
        .where('id', user.id)
        .update({
          'email': email,
          'phone': phone,
          'fullname': fullname
        });


      } else {
        await Database.table('users')
        .where('email', email).delete();

        response.send({
          code: 0,
          msg: 'Có lỗi sảy ra. Đăng ký lại !',
          data: ''
        });
      }

      response.send({
        code: 1,
        msg: 'success',
        data: ''
      });
    } else {
      response.send({
        code: 0,
        msg: error,
        data: ''
      });
    }
  }

  getDateTimeBefore(beforeDay) {
    let date = new Date();
    date.setDate(date.getDate() + beforeDay);
    let year = date.getFullYear();
    let month = ("0" + (date.getMonth() + 1)).slice(-2);
    let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    let hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    let minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    let seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();

    let fullDateTime = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
    return fullDateTime;
  }

  async login({ session, request, response }) {
    const { username, password, remember } = request.all();
    let error = '';

    if (username && password) {
      try {
        let user = await Database.table('users')
          .where('username', username)
          .first();

        if (user) {
          const checkAuth = await Hash.verify(password, user.password)
          if (checkAuth) {
            await Database.table('token_auths')
              .where('user_id', user.id)
              .update({
                'is_revoked': 1,
                'updated_at': Database.fn.now()
              });
            const authCookie = request.cookie('auth_cookie');
            await Database.table('token_auths')
              .insert({
                'user_id': user.id,
                'auth_token': authCookie,
                'device_info': request.header('User-Agent'),
                'created_at': Database.fn.now(),
                'updated_at': Database.fn.now()
              });

            return response.send({
              code: 1,
              msg: "Thành công !",
              referer: request.headers().referer ? request.headers().referer : '/'
            })
          } else {
            error = "Mật khẩu không đúng";
          }
        } else {
          error = "Không tìm thấy tài khoản";
        }

      } catch (e) {
        if (e.message.indexOf('E_PASSWORD_MISMATCH') !== -1) {
          error = "Mật khẩu không đúng";
        }

        if (e.message.indexOf('E_USER_NOT_FOUND') !== -1) {
          error = "Không tìm thấy tài khoản";
        }
      }
    } else {
      error = "Hãy điền tên đăng nhập và mật khẩu";
    }

    if (error !== '') {
      return response.send({
        code: 0,
        msg: error,
      })
    }
  }

  async logout({ request, response }) {
    try {

      await Database.table('token_auths')
        .where('user_id', request.auth.userid)
        .update({
          'is_revoked': 1,
          'updated_at': Database.fn.now()
        });
      return response.redirect('/')
    } catch (e) {
      return response.redirect('/')
    }
  }

  async checkLogin({ request, response }) {
    try {
      if (request.auth) {
        return response.send({
          code: 1,
        })
      } else {
        return response.send({
          code: 0,
        })
      }
    } catch (e) {
      return response.send({
        code: 0,
      })
    }
  }

  show({ auth, params }) {
    if (auth.user.id !== Number(params.id)) {
      return "You cannot see someone else's profile"
    }
    return auth.user
  }
}

module.exports = AuthController;
