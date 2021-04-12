<template>
    <div>
        <div class="bg-secondary py-2">
            <div class="container py-2 py-lg-3">
                <div class="order-lg-1 pr-lg-4 text-center text-lg-left">
                    <h1 class="h3 mb-0">{{ lesson.title }}</h1>
                </div>
                <div class="order-lg-2 mb-3 mb-lg-0 pt-lg-2">
                    <nav aria-label="breadcrumb">
                        <ol class="breadcrumb flex-lg-nowrap justify-content-center justify-content-lg-start">
                            <li class="breadcrumb-item"><router-link class="text-nowrap" to="/"><i class="czi-home"></i>Trang chủ</router-link></li>
                            <li class="breadcrumb-item" v-for="(bc, index) in breadcrumb" :key="index"><router-link class="text-nowrap" :to="bc.url">{{ bc.title }}</router-link></li>
                            <li class="breadcrumb-item text-nowrap active" aria-current="page">{{ lesson.title }}</li>
                        </ol>
                    </nav>
                </div>
            </div>
        </div>
        <section class="container pt-grid-gutter" v-if="errorCode == 0">
            <div class="row" id="video" v-if="lesson.baihat">
                <div class="col-12 mb-3">
                    <h2 class="h4 pb-3">1. Bài hát</h2>
                    <video-h-l-s :src="baihat" :img="lesson.image" />
                </div>
            </div>

            <div class="row" id="pronounce" v-if="lesson.tuvung">
                <div class="col-12 mb-3">
                    <h2 class="h4 pb-3">2. Từ vựng - Phát âm</h2>
                    <video-h-l-s :src="tuvung" :img="lesson.image" />
                </div>
            </div>

            <div class="row" id="picture" v-if="lesson.sach">
                <div class="col-12 mb-3">
                    <h2 class="h4 pb-3">3. Sách</h2>

                    <div class="row no-gutters pl-1">
                        <div class="col-sm-4 px-2 mb-grid-gutter">
                            <!-- <div id="book1-trigger" class="d-block text-center text-decoration-none mr-1">
                            <img class="d-block rounded mb-3" src="/images/courses/level1.jpg">
                            </div> -->
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-12">
                            <div class="book-modal">
                                <flipbook class="flipbook" startPage="0" :pages="bookArr"></flipbook>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section class="container pt-grid-gutter" v-if="errorCode == 5">
            <div class="row" style="min-height: 400px;">
                <div class="col-lg-12 col-sm-12 mb-grid-gutter">
                    <div class="card border-0 box-shadow">
                        <div class="media d-block d-sm-flex align-items-center p-3 border-bottom">
                            <div>
                                <h5>Nội dung này cần đăng nhập tài khoản</h5>
                                <p>Nếu bạn đã có tài khoản hãy <router-link to="/dang-nhap">Đăng nhập</router-link> tài khoản để tiếp tục</p>
                                <p>Nếu bạn chưa có tài khoản hãy <router-link to="/dang-ky">Đăng ký</router-link> tài khoản mới</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import { $themeConfig } from '@themeConfig'
import useJwt from '@/auth/jwt/useJwt'
import Flipbook from 'flipbook-vue'
import VideoHLS from '../components/Video.vue'

export default {
    data() {
        return {
            lesson: null,
            breadcrumb: [],
            baihat: '',
            tuvung: '',
            errorCode: 0,
            bookArr: []
        }
    },
    components: {
        VideoHLS,
        Flipbook
    },
    created() {
        this.fetchCourse()
    },
    computed: {
    },
    methods: {
        fetchCourse() {
            const slug = this.$route.params.slug.split('-')
            const id = slug[slug.length - 1]
            useJwt.get('/home/lesson', {
                params: {
                    id
                }
            }).then(response => {
                if (response.data.code === 1) {
                    const data = response.data.data
                    if (data) {
                        this.breadcrumb = data.breadcrumb
                        this.lesson = data.lesson
                        this.baihat = this.lesson.baihat
                        this.tuvung = this.lesson.tuvung
                        document.title = this.lesson.title + $themeConfig.app.appName
                        if (data.lesson && data.lesson.sach) {
                            for (let index = 0; index < data.lesson.sach.length; index++) {
                                const element = data.lesson.sach[index];
                                this.bookArr.push(element.item)
                            }
                        }
                    }
                }

                if (response.data.code === 5) {
                    this.errorCode = 5
                }

                if (response.data.code === 3) {
                    window.history.go(-1)
                }
            })
        }
    }
}
</script>

<style scoped>

.flipbook {
    width: 100%;
    /* width: 90vw; */
    height: 90vh;
}
</style>

<style>

.flipbook-container {
    background-color: antiquewhite;
}
</style>