<template>
    <section>
        <div class="container py-5 py-lg-5 my-5">
            <div class="row">
                <div class="col-md-6 m-auto">
                    <div class="card border-0 box-shadow">
                        <div class="card-body">
                            <h2 class="h2 mb-1 text-center">Đăng ký</h2>
                            <div class="py-3"><div class="signup-notification" role="alert"></div></div>
                            <div class="needs-validation pt-2" novalidate="" id="signup">
                                <p class="mb-2 text-danger"><span class="badge badge-pill badge-danger">01</span> Thông tin bắt buộc (bắt buộc)</p>
                                <hr class="pb-3">
                                <!-- {{ csrfField() }} -->
                                <div class="input-group-overlay form-group">
                                    <div class="input-group-prepend-overlay"><span class="input-group-text"><i class="czi-user"></i></span></div>
                                    <input class="form-control prepended-form-control" v-model="username" autofocus type="text" placeholder="Tên đăng nhập. Ví dụ esing123" required="">
                                </div>
                                <div class="input-group-overlay form-group">
                                    <div class="input-group-prepend-overlay"><span class="input-group-text"><i class="czi-key"></i></span></div>
                                    <input class="form-control prepended-form-control" type="text" v-model="productcode" placeholder="Mã sản phẩm. Ví dụ 43-2454-34" required="">
                                </div>
                                <div class="input-group-overlay form-group">
                                    <div class="input-group-prepend-overlay"><span class="input-group-text"><i class="czi-locked"></i></span></div>
                                    <div class="password-toggle">
                                        <input class="form-control prepended-form-control" type="password" v-model="password" placeholder="Mật khẩu" required="">
                                        <label class="password-toggle-btn">
                                            <input class="custom-control-input" type="checkbox"><i class="czi-eye password-toggle-indicator"></i><span class="sr-only">Hiện mật khẩu</span>
                                        </label>
                                    </div>
                                </div>
                                <div class="input-group-overlay form-group">
                                    <div class="input-group-prepend-overlay"><span class="input-group-text"><i class="czi-locked"></i></span></div>
                                    <div class="password-toggle">
                                        <input class="form-control prepended-form-control" type="password" v-model="repassword" placeholder="Nhập lại mật khẩu" required="">
                                        <label class="password-toggle-btn">
                                            <input class="custom-control-input" type="checkbox"><i class="czi-eye password-toggle-indicator"></i><span class="sr-only">Hiện mật khẩu</span>
                                        </label>
                                    </div>
                                </div>
                                <p class="mb-2 text-info"><span class="badge badge-pill badge-info">02</span> Thông tin cá nhân (không bắt buộc - nên có)</p>
                                <hr class="pb-3">

                                <div class="input-group-overlay form-group">
                                    <div class="input-group-prepend-overlay"><span class="input-group-text"><i class="czi-mail"></i></span></div>
                                    <input class="form-control prepended-form-control" type="email" v-model="email" placeholder="Email của bạn">
                                </div>

                                <div class="input-group-overlay form-group">
                                    <div class="input-group-prepend-overlay"><span class="input-group-text"><i class="czi-phone"></i></span></div>
                                    <input class="form-control prepended-form-control" type="text" v-model="phone" placeholder="Số điện thoại của bạn">
                                </div>

                                <div class="input-group-overlay form-group">
                                    <div class="input-group-prepend-overlay"><span class="input-group-text"><i class="czi-user"></i></span></div>
                                    <input class="form-control prepended-form-control" type="text" v-model="fullname" placeholder="Họ và tên">
                                </div>

                                <p class="mb-2 text-success"><span class="badge badge-pill badge-success">03</span> Quy định sử dụng</p>
                                <hr class="pb-3">

                                <div class="d-flex flex-wrap justify-content-between">
                                    <div class="custom-control custom-checkbox">
                                        <input class="custom-control-input" name="remember_me" type="checkbox" checked="" id="remember_me">
                                        <label class="custom-control-label" for="remember_me">Tôi đồng ý với Điều khoản và Quy định sử dụng tại esing123.com</label>
                                    </div>
                                </div>
                                <hr class="mt-4 mb-4">
                                <span>Đã có tài khoản? <router-link to="/dang-nhap">Đăng nhập ngay</router-link></span>
                                <hr class="mt-4">
                                <div class="text-right pt-4">
                                    <button class="btn btn-primary" ><i class="czi-user mr-2 ml-n21"></i>Đăng ký</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import { $themeConfig } from '@themeConfig'
import useJwt from '@/auth/jwt/useJwt'

export default {
    data() {
        return {
            error: "",
            username: "",
            productcode: "",
            password: "",
            repassword: "",
            email: "",
            phone: "",
            fullname: "",
        };
    },
    created() {
        document.title = `Đăng ký${$themeConfig.app.appName}`
    },
    methods: {
        login() {
            this.error = '';

            if (this.username === '') {
                this.error = 'Hãy nhập tên đăng nhập'
            }

            if (this.productcode === '') {
                this.error = 'Hãy nhập mã sản phẩm'
            }

            if (this.repassword === '') {
                this.error = 'Mật khẩu không khớp'
            }

            if (this.password === '') {
                this.error = 'Hãy nhập mật khẩu'
            }

            if (this.error === '') {
            useJwt.login({
                username: this.username,
                productcode: this.productcode,
                password: this.password,
                })
                .then(response => {
                    if (response.data.code === 1) {
                        this.$router.replace('/dang-nhap')
                    } else {
                        if (response.data.message && response.data.message.indexOf('E_PASSWORD_MISMATCH') !== -1) {
                            this.error = "Mật khẩu hoặc tài khoản không đúng"
                        } else {
                            this.error = response.data.message
                        }
                    }
                })
                .catch(err => {
                    this.error = err.response.data.error
                });
            }
        },
    },
};
</script>

<style>
</style>