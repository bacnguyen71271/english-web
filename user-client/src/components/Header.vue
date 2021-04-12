<template>
    <header class="box-shadow-sm">
    <!-- Remove "navbar-sticky" class to make navigation bar scrollable with the page.-->
        <div class="navbar-sticky bg-light">
            <div class="navbar navbar-expand-lg navbar-light py-0 pb-2">
                <div class="container">
                <router-link class="navbar-brand d-none d-sm-block mr-3 flex-shrink-0 text-logo" to="/" style="min-width: 7rem;">
                    <h1 style="margin-bottom: 0px; font-size: 2.4rem; color: #0d87e0;">ESING<span style="font-size: 1.6rem;">-unso</span></h1>
                    <h3 style="text-align: center;color: #0d87e0; font-size: 1rem; margin-bottom: 0px; font-weight: 400;">Nghe là nhớ !</h3>
                </router-link>
                <a class="navbar-brand d-sm-none mr-2" href="/" style="min-width: 4.625rem;">
                    <h1 style="line-height: 27px;margin-bottom: 0px; font-size: 2.4rem; color: #0d87e0;">ESING<span style="font-size: 1.6rem;">-unso</span></h1>
                    <h3 style="text-align: center;color: #0d87e0; font-size: 1rem; margin-bottom: 0px; font-weight: 400;">Nghe là nhớ !</h3>
                </a>
                    <div class="navbar-toolbar d-flex flex-shrink-0 align-items-center">
                        <a class="navbar-tool navbar-stuck-toggler" href="#"><span
                                    class="navbar-tool-tooltip">Menu</span>
                            <div class="navbar-tool-icon-box"><i class="navbar-tool-icon czi-menu"></i></div>
                        </a>
                        <a v-if="!userData" class="navbar-tool ml-1 ml-lg-0 mr-n1 mr-lg-2" href="#signin-modal" data-toggle="modal">
                            <div class="navbar-tool-icon-box"><i class="navbar-tool-icon czi-user"></i></div>
                            <div class="navbar-tool-text ml-n3"><small>Xin chào</small><router-link to="/dang-ky">Đăng ký</router-link>/ <router-link to="/dang-nhap">Đăng nhập</router-link></div>
                        </a>
                        <div class="navbar-tool dropdown ml-3" v-if="userData">
                            <a class="topbar-link" style="display: contents;" href="#" data-toggle="dropdown" aria-expanded="false">
                                <div class="navbar-tool-icon-box"><i class="navbar-tool-icon czi-user"></i></div>
                                <div class="navbar-tool-text ml-n3">
                                    <small>Xin chào, {{  userData.username }} </small>
                                    Tài khoản của tôi
                                </div>
                            </a>
                            <ul class="dropdown-menu dropdown-menu-right">
                                <li class="dropdown-divider"></li>
                                <li><a class="dropdown-item" href="" @click="logOut()">Đăng xuất</a></li>
                            </ul>
                        </div>
                    <button class="navbar-toggler collapsed" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-expanded="false"><span class="navbar-toggler-icon"></span></button>
                    </div>
                </div>
            </div>
            <div class="navbar navbar-expand-lg navbar-light navbar-stuck-menu mt-n2 py-0" style="background-color: #0e87e0;">
                <div class="container">
                    <div class="collapse navbar-collapse" id="navbarCollapse">
                        <ul class="navbar-nav">
                            <li v-for="(item, index) in menu" :key="index" class="nav-item"><router-link class="nav-link" :to="item.link">{{ item.title }}</router-link></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>

<script>
import useJwt from '@/auth/jwt/useJwt'

export default {
    data() {
        return {
            menu: [],
            userData: JSON.parse(localStorage.getItem('userData')),
        }
    },
    methods: {
        logOut() {
            localStorage.removeItem(useJwt.jwtConfig.storageTokenKeyName)
            localStorage.removeItem('userData')
            this.$router.push({ name: 'auth-login' })
        }
    },
    created() {
        useJwt.get('/home/menu', {
            params: {
                location: 'menu-top'
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