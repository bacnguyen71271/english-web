<template>
    <section>
        <div class="container d-flex py-5">
            <div class="login-form m-auto py-3 my-4">
                <h3 class="text-center mb-3">Đăng nhập tài khoản của bạn</h3>
                <div style="height:60px">
                    <div v-if="error != ''" class="alert alert-danger" role="alert">{{ error }}</div>
                </div>
                <div class="row">
                    <div class="form-group col-12">
                        <span>Tên đăng nhập</span>
                        <input
                        class="form-control"
                        name="username"
                        v-model="userEmail"
                        type="text"
                        placeholder="Tên đăng nhập"
                        value=""
                        />
                    </div>
                </div>
                <div class="row">
                    <div class="form-group col-12">
                        <span>Mật khẩu</span>
                        <input
                        class="form-control"
                        name="password"
                        v-model="password"
                        type="password"
                        placeholder="Mật khẩu"
                        />
                    </div>
                </div>
                <div class="row">
                    <div class="form-group col-12">
                        <label
                        ><input type="checkbox" name="remember" value="" /> Ghi nhớ đăng
                        nhập</label
                        >
                    </div>
                </div>
                <div class="row">
                    <div class="form-group col-12">
                        <button class="btn btn-success w-100 mt-2" @click="login()">
                            <strong>ĐĂNG NHẬP</strong>
                        </button>
                    </div>
                </div>
                <span>Chưa có tài khoản? <router-link to="/dang-ky">Đăng ký ngay</router-link></span>
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
            password: "",
            userEmail: "",
        };
    },
    created() {
        document.title = `Đăng nhập${$themeConfig.app.appName}`
    },
    methods: {
        login() {
            this.error = '';

            if (this.userEmail === '') {
                this.error = 'Hãy nhập tên đăng nhập'
            }

            if (this.password === '') {
                this.error = 'Hãy nhập mật khẩu'
            }

            if (this.error === '') {
            useJwt.login({
                username: this.userEmail,
                password: this.password,
                })
                .then(response => {
                    if (response.data.code === 1) {
                        useJwt.setToken(response.data.data.accessToken);

                        useJwt.getUser().then(response2 => {
                        if (response2.data.code === 1) {
                            const userData = response2.data.data;
                            localStorage.setItem("userData", JSON.stringify(userData));
                            window.location.reload()
                        } else {
                            this.status = response2.data.message
                        }
                        });
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