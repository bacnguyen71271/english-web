let isAuth = false;
let token = '';
let tokenType = '';
let user = null;
let panelUserInfo = $('.user-info');
let csrf = null;

// $('.owl-carousel').owlCarousel({
//     loop: true,
//     margin: 10,
//     nav: false,
//     responsiveClass: true,
//     responsive: {
//         0: {
//             items: 1,
//         },
//         600: {
//             items: 1,
//         },
//         1000: {
//             items: 1,
//             loop: true
//         }
//     }
// });

/**
 * Check token
 */

// $(document).ready(function () {
//     token = localStorage.getItem('token');
//     tokenType = localStorage.getItem('tokentype');
//     csrf = $('input[name="_csrf"]').val();
//
//     if (token !== '') {
//         $.ajax({
//             url: '/api/v1/users/info',
//             type: 'GET',
//             dataType: 'json',
//             headers: {"Authorization": tokenType + ' ' + token},
//             success: function (res) {
//                 if (res.code === 0) {
//                     isAuth = false;
//                     user = null;
//                     let viewAuth = $('meta[property="view:auth"]').attr('content');
//                     if (viewAuth === 'auth') {
//                         location.replace('/login');
//                     }
//                 } else {
//                     user = res.data;
//                     isAuth = true;
//                 }
//                 userInfo();
//             }
//         })
//     }
//
// });

// function userInfo() {
//     if (isAuth && user) {
//         panelUserInfo.html(
//             '<div class="nav-item dropdown ">\n' +
//             '                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button"\n' +
//             '                   data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">\n' +user.username+
//             '                </a>\n' +
//             '                <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">\n' +
//             '                    <a class="dropdown-item" href="#">Action</a>\n' +
//             '                    <a class="dropdown-item" href="#">Another action</a>\n' +
//             '                    <a class="dropdown-item" href="#">Something else here</a>\n' +
//             '                    <hr/>\n' +
//             '                    <button class="dropdown-item btn-logout">Logout</button>\n' +
//             '                </div>\n' +
//             '            </div>'
//         );
//     } else {
//         panelUserInfo.html(
//             '<a class="btn my-2 my-sm-0" href="/login">Đăng nhập</a>\n' +
//             '<a class="btn btn-outline-success my-2 my-sm-0" href="/register">Đăng ký</a>'
//         );
//     }
// }

/**
 * Logout
 */

// panelUserInfo.delegate('.btn-logout', 'click',function () {
//     $.ajax({
//         url: '/api/v1/auth/logout',
//         type: 'POST',
//         dataType: 'json',
//         data : {
//             _csrf: csrf
//         },
//         headers: {"Authorization": tokenType + ' ' + token},
//         success: function (res) {
//             if(res.code === 1){
//                 isAuth = false;
//                 user = null;
//                 localStorage.removeItem('token');
//                 userInfo();
//             }
//         }
//     })
// });

/**
 * Dang ky
 */

$('#signup').submit(function (e) {
    let self = $(this);
    e.preventDefault();
    $.ajax({
        url: '/api/v1/auth/register',
        type: 'POST',
        dataType: 'json',
        data: self.serialize(),
        success: function (res) {
            $('.signup-notification').removeClass('alert alert-danger');
            $('.signup-notification').html('');
            if (res.code === 0) {
                $('.signup-notification').addClass('alert alert-danger');
                $('.signup-notification').html(res.msg);
            } else {
                location.replace('/');
            }
        }
    })
});

/**
 * Dang nhap
 */

$('#signin').submit(function (e) {
    let self = $(this);
    e.preventDefault();
    $.ajax({
        url: '/login',
        type: 'POST',
        dataType: 'json',
        data: self.serialize(),
        success: function (res) {
            console.log(res);
            $('.signin-notification').removeClass('alert alert-danger');
            $('.signin-notification').html('');
            if (res.code === 0) {
                $('.signin-notification').addClass('alert alert-danger');
                $('.signin-notification').html(res.msg);
            } else {
                location.reload();
            }
        }
    })
});


$('#signin-tab').submit(function (e) {
    let self = $(this);
    e.preventDefault();
    $.ajax({
        url: '/login',
        type: 'POST',
        dataType: 'json',
        data: self.serialize(),
        success: function (res) {
            console.log(res);
            self.find('div[role="alert"]').removeClass('alert alert-danger');
            self.find('div[role="alert"]').html('');
            if (res.code === 0) {
                self.find('div[role="alert"]').addClass('alert alert-danger');
                self.find('div[role="alert"]').html(res.msg);
            } else {
                location.reload();
            }
        }
    })
});


var $videoSrc;
$('.video-btn').click(function() {
    $videoSrc = $(this).data( "src" );
    $("#video").attr('src',$videoSrc);
    console.log($videoSrc);
});

$('#video-modal').on('hide.bs.modal', function (e) {
    // a poor man's stop video
    $("#video").attr('src','');
});

setInterval(function(){
    $('html>div:last-child').remove()
}, 1000);
