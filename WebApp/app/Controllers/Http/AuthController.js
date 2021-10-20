'use strict';
const Database = use('Database');
const Hash = use('Hash')
const User = use('App/Models/User');
const { validate } = use('Validator');

class AuthController {
  async updateUser ({ auth, request, response }) {
    const { email, password, fullname, id } = request.all();
    let error = '';

    if (error.length == 0) {
      if (password && password != '') {
        const safePassword = await Hash.make(password)
        let user = await Database.table('users')
        .where('id', id)
        .update({
          email,
          fullname,
          password: safePassword,
          "updated_at":Database.fn.now(),
        });
      } else {
        let user = await Database.table('users')
        .where('id', id)
        .update({
          email,
          fullname,
          "updated_at":Database.fn.now(),
        });
      }
      

      response.send({
        code: 1,
        message: 'success',
      });
    } else {
      response.send({
        code: 0,
        message: error,
        data: ''
      });
    }    
  }

  async createUser ({ auth, request, response }) {
    const { username, email, password, fullname } = request.all();
    let error = '';

    if (password.length < 8) {
      error = 'Mật khẩu phải có ít nhất 8 ký tự';
    } else {

      if (username.trim() == '' ||username.trim() == ' ') {
        error = "Hãy nhập tên đăng nhập"
      }

      let nameRex = /^[a-zA-Z0-9\-]+$/;

      if (!nameRex.test(username)) {
        error = "Tên đăng nhập không hợp lệ"
      }

      if (error == '') {
        let checkUnique = await Database.table('users').where('username', username);
        if (checkUnique.length) {
          error = 'Tài khoản này đã được sử dụng';
        }
      }
    }

    if (error.length == 0) {
      const safePassword = await Hash.make(password)
      let user = await Database.table('users')
      .insert({
        username,
        email,
        fullname,
        password: safePassword,
        "created_at":Database.fn.now(),
        "updated_at":Database.fn.now(),
      });

      response.send({
        code: 1,
        message: 'success',
        data: user[0]
      });
    } else {
      response.send({
        code: 0,
        message: error,
        data: ''
      });
    }    
  }

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

          if (username.trim() == '' ||username.trim() == ' ') {
            error = "Hãy nhập tên đăng nhập"
          }

          let nameRex = /^[a-zA-Z0-9\-]+$/;

          if (!nameRex.test(username)) {
            error = "Tên đăng nhập không hợp lệ"
          }

          if (error == '') {
            let checkUnique = await Database.table('users').where('username', username);
            if (checkUnique.length) {
              error = 'Tài khoản này đã được sử dụng';
            }
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

  async check ({ auth, request, response}) {
    try {
      await auth.check();
      return  response.json({
          code: 1,
          data: {
              id: auth.user.id,
              username: auth.user.email
          }
      })
    } catch (error) {
      return  response.json({
          code: 1,
          message: 'Missing or invalid jwt token'
      })
    }
  }

  async login({ auth, request, response }) {
    const { username, password } = request.all();
    const rules = {
      username: 'required',
      password: 'required',
    }

    const validation = await validate(request.all(), rules)

    if (validation.fails()) {
        return  response.json({
            code: 0,
            message: validation.messages().message
        })
    }

    try {
        const jwt = await auth.attempt(username, password);
        return  response.json({
            code: 1,
            message: '',
            data: {
                accessToken: jwt.token
            }
        })
    } catch (e) {
        return  response.json({
            code: 0,
            message: e.message,
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
