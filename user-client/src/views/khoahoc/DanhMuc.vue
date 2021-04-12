<template>
  <div>
        <div class="bg-secondary py-2">
            <div class="container py-2 py-lg-3">

                <div class="order-lg-1 pr-lg-4 text-center text-lg-left">
                    <h1 class="h3 mb-0">{{ category_name }}</h1>
                </div>
                <div class="order-lg-2 mb-3 mb-lg-0 pt-lg-2">
                    <nav aria-label="breadcrumb">
                        <ol class="breadcrumb flex-lg-nowrap justify-content-center justify-content-lg-start">
                            <li class="breadcrumb-item"><router-link class="text-nowrap" to="/"><i class="czi-home"></i>Trang chủ</router-link></li>
                            <li class="breadcrumb-item text-nowrap active" aria-current="page">{{ category_name }}</li>
                        </ol>
                    </nav>
                </div>
            </div>
        </div>
        <section class="container pt-grid-gutter" style="min-height: 500px;" v-if="courseList.length > 0">
            <!-- <div class="row">
                <div class="col-12">
                    <div class="block-title">
                        <h2 class="">Bài học</h2>
                    </div>
                </div>
            </div> -->
            <div class="row">
                <div class="col-lg-4 col-sm-6 mb-grid-gutter" v-for="course in courseList" :key="course.id">
                    <div class="card border-0 box-shadow">
                        <router-link :to="'/khoa-hoc/'+course.url">
                            <img class="card-img-top" :src="course.image" :alt="course.title">
                        </router-link>
                        <div class="card-body">
                            <router-link :to="'/khoa-hoc/'+course.url"><h5>{{ course.title }}</h5></router-link>
                            <ul class="list-unstyled mb-0" >
                                <li class="media py-2 mb-0 border-top" v-for="(lesson, index) in course.lessons.slice(0,2)" :key="lesson.id">
                                    <router-link class="d-flex text-heading" :to="'/bai-giang/'+lesson.url">
                                        <span class="text-primary">- Unit {{ index + 1 }} :</span>
                                        <div class="media-body pl-3">{{ lesson.title }}</div>
                                    </router-link>
                                </li>
                                <li class="media py-2 mb-0 border-top">
                                    <router-link :to="'/khoa-hoc/'+course.url" class="d-flex text-info m-auto">Xem thêm</router-link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section class="container pt-grid-gutter" style="min-height: 500px;" v-if="categoryList.length > 0">
            <!-- <div class="row">
                <div class="col-12">
                    <div class="block-title">
                        <h2 class="">Danh mục</h2>
                    </div>
                </div>
            </div> -->
            <div class="row">
                <div class="col-lg-4 col-sm-6 mb-grid-gutter" v-for="category in categoryList" :key="category.id">
                    <div class="card border-0 box-shadow">
                        <router-link :to="category.url">
                            <img class="card-img-top" v-if="category.image" :src="category.image" :alt="category.title">
                        </router-link>
                        <div class="card-body">
                            <router-link :to="category.url"><h5>{{ category.title }}</h5></router-link>
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
            category_name: '',
            courseList: [],
            categoryList: []
        }
    },
    watch: {
        $route(to, from) {
            this.fetchCourse()
        }
    },
    created() {
        this.fetchCourse()
    },
    methods: {
        fetchCourse() {
            const slug = this.$route.params.slug.split('-')
            const id = slug[slug.length - 1]
            useJwt.get('/home/category-and-course', {
                params: {
                    id
                }
            }).then(response => {
                if (response.data.code === 1) {
                    const data = response.data.data
                    if (data) {
                        this.category_name = data.categoryinfo.title
                        this.courseList = data.course
                        this.categoryList = data.category
                        document.title = this.category_name + $themeConfig.app.appName
                    }
                }
            })
        }
    }
}
</script>

<style>

</style>