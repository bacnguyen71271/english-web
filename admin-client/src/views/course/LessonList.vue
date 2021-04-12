<template>
    <div>
        <b-modal size="lg" @ok="modalOk" id="modal-login" cancel-variant="outline-secondary" ok-title="Submit" cancel-title="Cancel" centered :title="modalAddCourseTitle" v-model="showCourseAddModal" >
            <b-form>
                <b-form-group>
                    <label for="email">Tên bài giảng:</label>
                    <b-form-input type="text" v-model="lessonInfo.title" placeholder="Tên bài giảng"/>
                </b-form-group>
                <!-- <b-form-group label="Danh mục" label-for="v-email">
                    <b-form-select
                        v-model="form_categoryValue"
                        :options="categoryOption"
                        :select-size="6"
                    />
                </b-form-group> -->
                <b-form-group>
                    <label for="password">1. Bài hát</label>
                    <image-browser type="video" v-model="lessonInfo.baihat"/>
                </b-form-group>
                <b-form-group>
                    <label for="password">2. Từ vựng - Phát âm</label>
                    <image-browser type="video" v-model="lessonInfo.tuvung"/>
                </b-form-group>
                <b-form-group>
                    <label for="password">3. Sách</label>
                    <image-browser v-model="lessonInfo.sach"/>
                </b-form-group>
                <b-form-group>
                    <label for="password">Ảnh đại diện</label>
                    <image-browser v-model="lessonInfo.image"/>
                </b-form-group>
                <b-form-group>
                  <b-form-checkbox id="checkbox-3" name="checkbox-3" v-model="lessonInfo.status" >
                    Xuất bản
                  </b-form-checkbox>
                </b-form-group>
            </b-form>
        </b-modal>
        <b-row class="match-height">
            <b-col md="12" lg="12">
            <b-card no-body>
                <b-card-body>
                    <!-- <b-card-title>Danh sách bài giảng</b-card-title> -->
                    <router-link class="edit-product btn btn-warning waves-effect waves-light mr-1 mb-2 fload" style="float: right;" :to="'/course/lesson/'+$route.params.id+'/add/'">Thêm bài giảng mới</router-link>
                    <!-- <b-button v-ripple.400="'rgba(255, 255, 255, 0.15)'" type="button" @click="modalAddCourseTitle = 'Thêm khóa học', showCourseAddModal = true, modalMode = 'add', resetForm()" variant="primary" style="float: right;" class="mr-1 mb-2 fload" >Thêm bài giảng mới</b-button> -->
                    <div class="table-responsive">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>IMAGE</th>
                                    <th>TIÊU ĐỀ</th>
                                    <th>LOẠI</th>
                                    <th>KHÓA HỌC</th>
                                    <th>TRẠNG THÁI</th>
                                    <th width="220"></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="lesson in lessonList" :key="lesson.id">
                                    <td>
                                        <span class="font-weight-bold">{{ lesson.id }}</span>
                                    </td>
                                    <td><img style="max-width: 100px" v-if="lesson.image" :src="lesson.image"></td>
                                    <td><a target="_blank" :href="'https://edusing123.com/bai-giang/'+lesson.url">{{ lesson.title }}</a></td>
                                    <td>{{ lesson.type == 1 ? "BÀI GIẢNG" : "TÀI LIỆU" }}</td>
                                    <td>
                                        <span class="badge badge-pill badge-light-primary mr-1">{{ lesson.course_title }}</span>
                                    </td>
                                    <td>{{ lesson.status ? "Mở" : "Đóng" }}</td>
                                    <td>
                                        <router-link class="edit-product btn btn-warning waves-effect waves-light mr-1" :to="'/course/lesson/'+$route.params.id+'/edit/' + lesson.id">Sửa</router-link>
                                        <!-- <div class="edit-product btn btn-primary waves-effect waves-light mr-1" @click="editItem(lesson)">Sửa</div> -->
                                        <div class="edit-delete btn btn-danger waves-effect waves-light" @click="deleteItem(lesson)">Xóa</div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </b-card-body>
            </b-card>
            </b-col>
        </b-row>
  </div>
</template>

<script>
import {
  BCard,
  BCardText,
  BButton,
  BRow,
  BCol,
  BImg,
  BCardBody,
  BCardTitle,
  BCardSubTitle,
  BLink,
  BForm,
  BFormCheckbox,
  BFormGroup,
  BFormInput,
  BFormSelect,
  BModal
} from 'bootstrap-vue';

import useJwt from '@/auth/jwt/useJwt'
import Ripple from 'vue-ripple-directive'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import ImageBrowser from '../components/ImageBrowser.vue';

export default {
    components: {
        BCard,
        BCardText,
        BButton,
        BCardBody,
        BCardTitle,
        BCardSubTitle,
        BRow,
        BCol,
        BLink,
        BImg,
        BForm,
        BFormCheckbox,
        BFormGroup,
        BFormInput,
        BFormSelect,
        ToastificationContent,
        BModal,
        ImageBrowser
    },
    directives: {
        Ripple,
    },
    data() {
        return {
            showCourseAddModal: false,
            modalAddCourseTitle: 'Thêm bài giảng',
            inputCourseTitle: '',
            courseImage: '',
            courseStatus: true,
            categoryOption: null,
            form_categoryValue: 0,
            lessonList: [],
            modalMode: 'add',
            idEdit: null,
            lessonInfo: {
                baihat: '',
                tuvung: '',
                sach: '',
                image: '',
                title: '',
                status: true
            }
        }
    },
    created() {
        this.fetchLesson()
    },
    methods: {
        deleteItem(course) {
            this.$bvModal
            .msgBoxConfirm(`Bạn muốn xóa danh mục ${course.title}`, {
                title: 'Please Confirm',
                size: 'sm',
                okVariant: 'primary',
                okTitle: 'Yes',
                cancelTitle: 'No',
                cancelVariant: 'outline-secondary',
                hideHeaderClose: false,
                centered: true,
            })
            .then(value => {
                if (value) {
                    useJwt.delete(`/course`, {
                        data: {
                            id: course.id
                        }
                    })
                    .then(response => {
                        if (response.data.code === 1) {
                            this.$toast({
                                component: ToastificationContent,
                                props: {
                                title: 'Notification',
                                icon: 'BellIcon',
                                text: '👋 Thành công.',
                                variant: 'success',
                                },
                            })
                            this.fetchCourse()
                        } else {
                            this.$toast({
                                component: ToastificationContent,
                                props: {
                                title: 'Notification',
                                icon: 'BellIcon',
                                text: response.data.message,
                                variant: 'danger',
                                },
                            })
                        }
                    })
                }
            })
        },
        convertCategory(array) {
            const data = []
            if (array && array.length) {
                for (let index = 0; index < array.length; index++) {
                    const element = array[index];
                    data.push({
                        value: element.id,
                        text: element.title,
                        status: element.status,
                        title: element.title,
                        parent_id: element.parent_id
                        })

                    for (let index2 = 0; index2 < element.childs.length; index2++) {
                        const element2 = element.childs[index2];
                        data.push({
                            value: element2.id,
                            text: `---| ${element2.title}`,
                            status: element2.status,
                            title: element2.title,
                            parent_id: element2.parent_id
                            })

                        for (let index3 = 0; index3 < element2.childs.length; index3++) {
                            const element3 = element2.childs[index3];
                            data.push({
                                value: element3.id,
                                text: `------| ${element3.title}`,
                                status: element3.status,
                                title: element3.title,
                                parent_id: element3.parent_id
                                })
                        }
                    }
                }
            }
            return data
        },
        fetchLesson() {
            useJwt.get('/lesson', {
                params: {
                    course_id: this.$route.params.id
                }
            })
            .then(response => {
                if (response.data.code === 1) {
                    this.lessonList = response.data.data
                } else {
                    this.$toast({
                        component: ToastificationContent,
                        props: {
                        title: 'Notification',
                        icon: 'BellIcon',
                        text: response.data.message,
                        variant: 'danger',
                        },
                    })
                }
            })
        },
        editItem(lesson) {
            this.lessonInfo.baihat = lesson.baihat
            this.lessonInfo.tuvung = lesson.tuvung
            this.lessonInfo.sach = lesson.sach
            this.lessonInfo.image = lesson.image
            this.lessonInfo.title = lesson.title
            this.lessonInfo.status = (lesson.status === 1 ? true : false)
            this.idEdit = lesson.id
            this.modalMode = 'edit'
            this.modalAddCourseTitle = "Sửa khóa học"
            this.showCourseAddModal = true
        },
        resetForm() {
            this.lessonInfo.baihat = ''
            this.lessonInfo.tuvung = ''
            this.lessonInfo.sach = ''
            this.lessonInfo.image = ''
            this.lessonInfo.title = ''
            this.lessonInfo.status = true
        },
        modalOk() {
            let request = null
            this.lessonInfo.course_id = this.$route.params.id
            if (this.modalMode === 'add') {
                request = useJwt.post('/lesson', {
                    title: this.lessonInfo.title,
                    course_id: this.lessonInfo.course_id,
                    image: this.lessonInfo.image,
                    baihat: this.lessonInfo.baihat,
                    tuvung: this.lessonInfo.tuvung,
                    sach: this.lessonInfo.sach,
                    status: this.lessonInfo.status,
                })
            } else {
                request = useJwt.put('/lesson', {
                    id: this.idEdit,
                    title: this.lessonInfo.title,
                    course_id: this.lessonInfo.course_id,
                    image: this.lessonInfo.image,
                    baihat: this.lessonInfo.baihat,
                    tuvung: this.lessonInfo.tuvung,
                    sach: this.lessonInfo.sach,
                    status: this.lessonInfo.status,
                })
            }
            request.then(response => {
                if (response.data.code === 1) {
                    this.$toast({
                        component: ToastificationContent,
                        props: {
                        title: 'Notification',
                        icon: 'BellIcon',
                        text: '👋 Thành công.',
                        variant: 'success',
                        },
                    })
                    this.fetchLesson()
                } else {
                    this.$toast({
                        component: ToastificationContent,
                        props: {
                        title: 'Notification',
                        icon: 'BellIcon',
                        text: response.data.message,
                        variant: 'danger',
                        },
                    })
                }
            })
        }
    }
};
</script>

<style>
</style>