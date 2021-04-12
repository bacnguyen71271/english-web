<template>
    <div>
        <b-modal @ok="modalOk" size="lg" id="modal-login" cancel-variant="outline-secondary" ok-title="Submit" cancel-title="Cancel" centered :title="modalAddCourseTitle" v-model="showCourseAddModal" >
            <b-form>
                <b-form-group>
                    <label for="email">Tên khóa học:</label>
                    <b-form-input type="text" v-model="inputCourseTitle" placeholder="Tên khóa học"/>
                </b-form-group>
                <b-form-group label="Danh mục" label-for="v-email">
                    <b-form-select
                        v-model="form_categoryValue"
                        :options="categoryOption"
                        :select-size="6"
                    />
                </b-form-group>
                <b-form-group>
                    <label for="password">Ảnh đại diện</label>
                    <image-browser v-model="courseImage"/>
                </b-form-group>
                <b-form-group>
                  <b-form-checkbox id="checkbox-3" name="checkbox-3" v-model="courseStatus" >
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
                    <b-button v-ripple.400="'rgba(255, 255, 255, 0.15)'" type="button" @click="modalAddCourseTitle = 'Thêm khóa học', showCourseAddModal = true, modalMode = 'add', resetForm()" variant="primary" style="float: right;" class="mr-1 mb-2 fload" >Thêm khóa học mới</b-button>
                    <div class="table-responsive">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>TÊN KHÓA HỌC</th>
                                    <th width="300">ẢNH</th>
                                    <th>DANH MỤC</th>
                                    <th>TRẠNG THÁI</th>
                                    <th width="340"></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="course in courseList" :key="course.id">
                                    <td>
                                        <span class="font-weight-bold">{{ course.id }}</span>
                                    </td>
                                    <td><a target="_blank" :href="'https://edusing123.com/bai-giang/'+course.url">{{ course.title }}</a></td>
                                    <td><img style="max-width: 220px" v-if="course.image" :src="course.image"></td>
                                    <td>
                                        <span class="badge badge-pill badge-light-primary mr-1">{{ course.category_title }}</span>
                                    </td>
                                    <td>{{ course.status ? "Mở" : "Đóng" }}</td>
                                    <td>
                                        <router-link class="edit-product btn btn-warning waves-effect waves-light mr-1" :to="'/course/lesson/' + course.id">Bài giảng</router-link>
                                        <div class="edit-product btn btn-primary waves-effect waves-light mr-1" @click="editItem(course)">Sửa</div>
                                        <div class="edit-delete btn btn-danger waves-effect waves-light" @click="deleteItem(course)">Xóa</div>
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
            modalAddCourseTitle: 'Thêm khóa học',
            inputCourseTitle: '',
            courseImage: '',
            courseStatus: true,
            categoryOption: null,
            form_categoryValue: 0,
            courseList: [],
            modalMode: 'add',
            idEdit: null
        }
    },
    created() {
        this.fetchCategory()
        this.fetchCourse()
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
        fetchCategory() {
            useJwt.get('/course/category')
            .then(response => {
                if (response.data.code === 1) {
                    this.category = response.data.data
                    this.categoryOption = [
                        {
                            value: 0,
                            text: '-- Không có thư mục cha --',
                            status: 0,
                            title: '',
                            parent_id: 0
                        }
                    ]
                    this.categoryOption = this.categoryOption.concat(this.convertCategory(this.category))
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
        fetchCourse() {
            useJwt.get('/course')
            .then(response => {
                if (response.data.code === 1) {
                    this.courseList = response.data.data
                }
            })
        },
        editItem(course) {
            this.inputCourseTitle = course.title
            this.form_categoryValue = course.category_id
            this.courseStatus = (course.status === 1 ? true : false)
            this.idEdit = course.id
            this.courseImage = course.image
            this.modalMode = 'edit'
            this.modalAddCourseTitle = "Sửa khóa học"
            this.showCourseAddModal = true
        },
        resetForm() {
            this.form_categoryValue = 0
            this.inputCourseTitle = ''
            this.courseStatus = true
            this.courseImage = ''
        },
        modalOk() {
            let request = null
            if (this.modalMode === 'add') {
                request = useJwt.post('/course', {
                    category_id: this.form_categoryValue,
                    title: this.inputCourseTitle,
                    status: this.courseStatus,
                    image: this.courseImage
                })
            } else {
                request = useJwt.put('/course', {
                    category_id: this.form_categoryValue,
                    title: this.inputCourseTitle,
                    status: this.courseStatus,
                    image: this.courseImage,
                    id: this.idEdit
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
                    this.resetForm()
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
    }
};
</script>

<style>
</style>