let isLogin = false;
let token = '';

$('.owl-carousel').owlCarousel({
    loop:true,
    margin:10,
    nav:false,
    responsiveClass:true,
    responsive:{
        0:{
            items:1,
        },
        600:{
            items:1,
        },
        1000:{
            items:1,
            loop:true
        }
    }
})

/**
 * Check token
 */
window.ready(function () {
    token = localStorage.getItem('token');
    if(token){
        $.ajax({
            url: '/api/v1/users/register',
            type: 'POST',
            dataType: 'json',
            data: self.serialize(),
            success: function (res) {
                self.find('.alert').removeClass('alert-danger');
                self.find('.alert').html('');
                if(res.code === 0){
                    self.find('.alert').addClass('alert-danger');
                    self.find('.alert').html(res.msg);
                }else{
                    localStorage.setItem('token',res.data.token);
                    location.replace('/');
                }
            }
        })
    }
});


/**
 * Dang ky
 */
$('.login-register-form').submit(function (e) {
    let self = $(this);
    e.preventDefault();
    $.ajax({
        url: '/api/v1/auth/register',
        type: 'POST',
        dataType: 'json',
        data: self.serialize(),
        success: function (res) {
            self.find('.alert').removeClass('alert-danger');
            self.find('.alert').html('');
            if(res.code === 0){
                self.find('.alert').addClass('alert-danger');
                self.find('.alert').html(res.msg);
            }else{
                localStorage.setItem('token',res.data.token);
                location.replace('/');
            }
        }
    })
});
