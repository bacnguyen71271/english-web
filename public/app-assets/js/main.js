let isAuth = false;
let token = '';
let tokenType = '';
let user = null;
let csrf = null;

/**
 * Check token
 */
$(document).ready(function () {
    token = localStorage.getItem('token');
    tokenType = localStorage.getItem('tokentype');
    csrf = $('input[name="_csrf"]').val();

    if (token !== '') {
        $.ajax({
            url: '/api/v1/users/info',
            type: 'GET',
            dataType: 'json',
            headers: {"Authorization": tokenType + ' ' + token},
            success: function (res) {
                if (res.code === 0) {
                    isAuth = false;
                    user = null;
                    let viewAuth = $('meta[property="view:auth"]').attr('content');
                    if (viewAuth === 'auth') {
                        location.replace('/login');
                    }
                } else {
                    user = res.data;
                    isAuth = true;
                    $('.user-name').html(user.username);
                }
            }
        })
    }

});

/**
 * Logout
 */
$('.btn-logout').click(function () {
    $.ajax({
        url: '/api/v1/auth/logout',
        type: 'POST',
        dataType: 'json',
        data : {
            _csrf: csrf
        },
        headers: {"Authorization": tokenType + ' ' + token},
        success: function (res) {
            if(res.code === 1){
                isAuth = false;
                user = null;
                localStorage.removeItem('token');
                location.replace('/login');
            }
        }
    })
});


/**
 * menu
 */

$('.nav-item').each(function (e) {
    let url = window.location.pathname;
    let menu_url = $(this).find('a').attr('href');
    if(menu_url === url){
        $(this).addClass('active');
    }
});
