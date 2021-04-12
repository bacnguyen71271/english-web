<template>
    <div>
        <div class="bg-secondary py-2" v-if="breadcrumb">
            <div class="container py-2 py-lg-3">
                <div class="order-lg-1 pr-lg-4 text-center text-lg-left">
                    <h1 class="h3 mb-0">{{ pageTitle }}</h1>
                </div>
                <div class="order-lg-2 mb-3 mb-lg-0 pt-lg-2">
                    <nav aria-label="breadcrumb">
                        <ol class="breadcrumb flex-lg-nowrap justify-content-center justify-content-lg-start">
                            <li class="breadcrumb-item"><router-link class="text-nowrap" to="/"><i class="czi-home"></i>Trang chủ</router-link></li>
                            <li class="breadcrumb-item" v-for="(bc, index) in breadcrumb.slice(0,breadcrumb.length-1)" :key="index"><router-link class="text-nowrap" :to="bc.url">{{ bc.title }}</router-link></li>
                            <li class="breadcrumb-item text-nowrap active" aria-current="page">{{ pageTitle }}</li>
                        </ol>
                    </nav>
                </div>
            </div>
        </div>
        <section class="container pt-grid-gutter" v-if="errorCode == 0">
            <div class="row" v-if="document.length > 0">
                <div class="col-lg-4 col-sm-6 mb-grid-gutter" v-for="ls in document" :key="ls.id">
                    <div class="card border-0 box-shadow">
                        <router-link class="" :to="'/bai-giang/' + ls.url">
                            <div class="card-body">
                                <h5>{{ ls.title }}</h5>
                            </div>
                        </router-link>
                    </div>
                </div>
            </div>
            <div class="row" v-if="lesson.length > 0">
                <div class="col-lg-6 col-sm-12 mb-grid-gutter" v-for="ls in lesson" :key="ls.id">
                    <div class="card border-0 box-shadow">
                        <div class="media d-block d-sm-flex align-items-center p-3 border-bottom">
                            <router-link class="d-block position-relative mb-3 mb-sm-0 mr-sm-4 mx-auto" :to="'/bai-giang/' + ls.url" style="width: 12.5rem;">
                                <img class="rounded-lg" :src="ls.image" :alt="ls.title">
                            </router-link>
                            <div class="media-body text-center text-sm-left">
                                <h3 class="h6 product-title mb-4"><router-link :to="'/bai-giang/' + ls.url">{{ ls.title }}</router-link></h3>
                                <router-link class="d-inline-block text-accent" :to="'/bai-giang/' + ls.url +'#video'">
                                    <i class="font-size-lg czi-youtube-outline"></i> Bài hát
                                </router-link>

                                <router-link class="d-inline-block text-accent border-left ml-2 pl-2" :to="'/bai-giang/' + ls.url +'#picture'">
                                    <i class="font-size-lg czi-image"></i> Sách
                                </router-link>

                                <router-link class="d-inline-block text-accent border-left ml-2 pl-2" :to="'/bai-giang/' + ls.url +'#pronounce'">
                                    <i class="font-size-lg czi-loudspeaker"></i> Phát âm
                                </router-link>
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

export default {
    data() {
        return {
            lesson: [],
            document: [],
            breadcrumb: [],
            errorCode: 0,
            pageTitle: '',
        }
    },
    created() {
        this.fetchCourse()
    },
    methods: {
        fetchCourse() {
            const slug = this.$route.params.slug.split('-')
            const id = slug[slug.length - 1]
            useJwt.get('/home/course', {
                params: {
                    id
                }
            }).then(response => {
                if (response.data.code === 1) {
                    const data = response.data.data
                    if (data) {
                        this.errorCode = 0
                        this.breadcrumb = data.breadcrumb
                        if (data.breadcrumb) {
                            this.pageTitle = this.breadcrumb[this.breadcrumb.length - 1].title || ''
                        }
                        this.lesson = data.lesson.filter(ls => { return ls.type === 1 })
                        this.document = data.lesson.filter(ls => { return ls.type === 2 })
                        document.title = this.breadcrumb[this.breadcrumb.length - 1].title + $themeConfig.app.appName
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

<style>

</style>