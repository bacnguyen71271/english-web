let isAuth = false;
let token = '';
let tokenType = '';
let user = null;
let panelUserInfo = $('.user-info');
let csrf = null;

let imageBookPath = '/books/';
let pdfBookPath = '/document/';
let imageBook = ["1", "8"][ Math.floor(Math.random()*2)];

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


                $('.signin-notification').addClass('alert alert-success');
                $('.signin-notification').html('Đăng ký thành công');

                $.ajax({
                  url: '/api/v1/auth/register',
                  type: 'POST',
                  dataType: 'json',
                  data: self.serialize(),
                  success: function (res) {

                  }
                })

                setTimeout(function () {
                  location.reload();
                }, 5000)
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
                location.replace('/');
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


$('video').each(function(){
   if($(this).data('src') !== null ){
       let videoSrc = $(this).data('src');
       if (Hls.isSupported()) {
           var hls = new Hls();
           hls.loadSource(videoSrc);
           hls.attachMedia($(this)[0]);
           hls.on(Hls.Events.MANIFEST_PARSED, function() {
               $(this).play();
           });
       }
       else if ($(this).canPlayType('application/vnd.apple.mpegurl')) {
           $(this).src = videoSrc;
           $(this).addEventListener('loadedmetadata', function() {
               $(this).play();
           });
       }
   }
});

function fullscreenErrorHandler(){
  if (self!=top) return "The frame is blocking full screen mode. Click on 'remove frame' button above and try to go full screen again."
}

function buildBook( elem, opt ){
  var book= $.wowBook(elem);
  if (!book) {
    $(elem).wowBook( opt );
    book = $.wowBook(elem);
  }
  book.showLightbox();
}


if (window.location.href.indexOf('edusing123.com') !== -1) {
  window.oncontextmenu = function (event) {
    event.preventDefault()
    event.stopPropagation()
    return false
  }

  function disableIE () {
    if (document.all) {
      return false
    }
  }

  function disableNS (e) {
    if (document.layers || (document.getElementById && !document.all)) {
      if (e.which == 2 || e.which == 3) {
        return false
      }
    }
  }

  if (document.layers) {
    document.captureEvents(Event.MOUSEDOWN)
    document.onmousedown = disableNS
  } else {
    document.onmouseup = disableNS
    document.oncontextmenu = disableIE
  }
  document.oncontextmenu = new Function('return false')

  $(function () {
    if (window._userdata && _userdata.page_desktop) window.location = _userdata.page_desktop
  })
  jQuery(document).ready(function ($) {
    var $ctsearch = $('#ct-search'),
      $ctsearchinput = $ctsearch.find('input.ct-search-input'),
      $body = $('html,body'),
      openSearch = function () {
        $ctsearch.data('open', true).addClass('ct-search-open')
        $ctsearchinput.focus()
        return false
      },
      closeSearch = function () {
        $ctsearch.data('open', false).removeClass('ct-search-open')
      }
    $ctsearchinput.on('click', function (e) {
      e.stopPropagation()
      $ctsearch.data('open', true)
    })
    $ctsearch.on('click', function (e) {
      e.stopPropagation()
      if (!$ctsearch.data('open')) {
        openSearch()
        $body.off('click').on('click', function (e) {
          closeSearch()
        })
      } else {
        if ($ctsearchinput.val() === '') {
          closeSearch()
          return false
        }
      }
    })
  })
  $(function () {
    $('img').on('error', function () {
      $(this).attr({
        alt: this.src,
        src: 'http://i39.servimg.com/u/f39/18/93/89/23/l1074210.png'
      })
    })
  })
  shortcut = {
    all_shortcuts: {},
    add: function (a, b, c) {
      var d = {
        type: 'keydown',
        propagate: !1,
        disable_in_input: !1,
        target: document,
        keycode: !1
      }
      if (c)
        for (var e in d) 'undefined' == typeof c[e] && (c[e] = d[e])
      else c = d
      d = c.target, 'string' == typeof c.target && (d = document.getElementById(c.target)), a = a.toLowerCase(), e = function (d) {
        d = d || window.event
        if (c.disable_in_input) {
          var e
          d.target ? e = d.target : d.srcElement && (e = d.srcElement), 3 == e.nodeType && (e = e.parentNode)
          if ('INPUT' == e.tagName || 'TEXTAREA' == e.tagName) return
        }
        d.keyCode ? code = d.keyCode : d.which && (code = d.which), e = String.fromCharCode(code).toLowerCase(), 188 == code && (e = ','), 190 == code && (e = '.')
        var f = a.split('+'),
          g = 0,
          h = {
            '`': '~',
            1: '!',
            2: '@',
            3: '#',
            4: '$',
            5: '%',
            6: '^',
            7: '&',
            8: '*',
            9: '(',
            0: ')',
            '-': '_',
            '=': '+',
            ';': ':',
            '\'': '"',
            ',': '<',
            '.': '>',
            '/': '?',
            '': '|'
          },
          i = {
            esc: 27,
            escape: 27,
            tab: 9,
            space: 32,
            'return': 13,
            enter: 13,
            backspace: 8,
            scrolllock: 145,
            scroll_lock: 145,
            scroll: 145,
            capslock: 20,
            caps_lock: 20,
            caps: 20,
            numlock: 144,
            num_lock: 144,
            num: 144,
            pause: 19,
            'break': 19,
            insert: 45,
            home: 36,
            'delete': 46,
            end: 35,
            pageup: 33,
            page_up: 33,
            pu: 33,
            pagedown: 34,
            page_down: 34,
            pd: 34,
            left: 37,
            up: 38,
            right: 39,
            down: 40,
            f1: 112,
            f2: 113,
            f3: 114,
            f4: 115,
            f5: 116,
            f6: 117,
            f7: 118,
            f8: 119,
            f9: 120,
            f10: 121,
            f11: 122,
            f12: 123
          },
          j = !1,
          l = !1,
          m = !1,
          n = !1,
          o = !1,
          p = !1,
          q = !1,
          r = !1
        d.ctrlKey && (n = !0), d.shiftKey && (l = !0), d.altKey && (p = !0), d.metaKey && (r = !0)
        for (var s = 0; k = f[s], s < f.length; s++) 'ctrl' == k || 'control' == k ? (g++, m = !0) : 'shift' == k ? (g++, j = !0) : 'alt' == k ? (g++, o = !0) : 'meta' == k ? (g++, q = !0) : 1 < k.length ? i[k] == code && g++ : c.keycode ? c.keycode == code && g++ : e == k ? g++ : h[e] && d.shiftKey && (e = h[e], e == k && g++)
        if (g == f.length && n == m && l == j && p == o && r == q && (b(d), !c.propagate)) return d.cancelBubble = !0, d.returnValue = !1, d.stopPropagation && (d.stopPropagation(), d.preventDefault()), !1
      }, this.all_shortcuts[a] = {
        callback: e,
        target: d,
        event: c.type
      }, d.addEventListener ? d.addEventListener(c.type, e, !1) : d.attachEvent ? d.attachEvent('on' + c.type, e) : d['on' + c.type] = e
    },
    remove: function (a) {
      var a = a.toLowerCase(),
        b = this.all_shortcuts[a]
      delete this.all_shortcuts[a]
      if (b) {
        var a = b.event,
          c = b.target,
          b = b.callback
        c.detachEvent ? c.detachEvent('on' + a, b) : c.removeEventListener ? c.removeEventListener(a, b, !1) : c['on' + a] = !1
      }
    }
  }, shortcut.add('Ctrl+U', function () {
    // top.location.href = "URL không copy lưu ở trên"
  }), shortcut.add('F12', function () {
    // top.location.href = "URL không copy lưu ở trên"
  })
}
