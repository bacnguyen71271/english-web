<template>
    <footer class="bg-dark pt-5">
        <div class="container">
            <div class="row pb-2">
                <div class="col-md-4 col-sm-6">
                    <div class="widget widget-links widget-light pb-2 mb-4">
                        <h2 class="widget-title text-light">Bản quyền thuộc ESING- unso</h2>
                        <ul class="widget-list">
                            <li class="widget-list-item d-flex widget-list-link"><p>Địa chỉ: Tòa R6, Royal City, Nguyễn Trãi, Thanh Xuân, Hà Nội</p></li>
                            <li class="widget-list-item d-flex widget-list-link">SĐT: <a class="widget-list-link ml-2" href="tel:0972325469"> 0972 325 469</a></li>
                            <li class="widget-list-item d-flex widget-list-link">Email: <a class="widget-list-link ml-2" href="mailto:edusing.unso@gmail.com"> edusing.unso@gmail.com</a></li>
                        </ul>
                    </div>
                </div>
                <div class="col-md-4 col-sm-6">
                    <div class="widget widget-links widget-light pb-2 mb-4">
                        <h3 class="widget-title text-light">Liên kết</h3>
                        <ul class="widget-list">
                            <li v-for="(item, index) in menu" :key="index" class="widget-list-item"><router-link class="widget-list-link" :to="item.link">{{ item.title }}</router-link></li>
                        </ul>
                    </div>

                </div>
                <div class="col-md-4">
                    <div class="widget pb-2 mb-4">
                        <h3 class="widget-title text-light pb-1">Nhận thông báo</h3>
                        <form class="validate" action="https://studio.us12.list-manage.com/subscribe/post-json?u=c7103e2c981361a6639545bd5&amp;amp;id=29ca296126&amp;c=?" method="get" name="mc-embedded-subscribe-form" id="mc-embedded-subscribe-form">
                            <div class="input-group input-group-overlay flex-nowrap">
                                <div class="input-group-prepend-overlay"><span class="input-group-text text-muted font-size-base"><i class="czi-mail"></i></span></div>
                                <input class="form-control prepended-form-control" type="email" name="EMAIL" id="mce-EMAIL" value="" placeholder="Email của bạn" required="">
                                <div class="input-group-append">
                                    <button class="btn btn-primary" type="submit" name="subscribe" id="mc-embedded-subscribe">Đăng ký</button>
                                </div>
                            </div>
                            <!-- real people should not fill this in and expect good things - do not remove this or risk form bot signups-->
                            <div style="position: absolute; left: -5000px;" aria-hidden="true">
                                <input type="text" name="b_c7103e2c981361a6639545bd5_29ca296126" tabindex="-1">
                            </div><small class="form-text text-light opacity-50" id="mc-helper">* Đăng ký nhận bản tin của chúng tôi để nhận được ưu đãi giảm giá sớm, cập nhật và thông tin sản phẩm mới.</small>
                            <div class="subscribe-status"></div>
                        </form>
                    </div>
                    <div class="widget pb-2 mb-4">
                        <h3 class="widget-title text-light pb-1">Tải ứng dụng</h3>
                        <div class="d-flex flex-wrap">
                            <div class="mr-2 mb-2"><a class="btn-market btn-apple" href="#" role="button"><span class="btn-market-subtitle">Download on the</span><span class="btn-market-title">App Store</span></a></div>
                            <div class="mb-2"><a class="btn-market btn-google" href="#" role="button"><span class="btn-market-subtitle">Download on the</span><span class="btn-market-title">Google Play</span></a></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="bg-darker">
            <div class="container">
                <div class="py-2 font-size-xs text-light opacity-50 text-center text-md-left">© All rights reserved. Made by <a class="text-light" href="/" target="_blank" rel="noopener">Esing123.com</a></div>
            </div>
        </div>
    </footer>
</template>

<script>
import useJwt from '@/auth/jwt/useJwt'

export default {
    data() {
        return {
            menu: [],
        }
    },
    created() {
        useJwt.get('/home/menu', {
            params: {
                location: 'menu-footer'
            }
        })
        .then(res => {
            if (res.data.code === 1) {
                this.menu = res.data.data
            }
        })
        .catch(err => {
        });
    },
}
</script>

<style>

</style>