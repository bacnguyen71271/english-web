<template>
    <div>
        <b-row class="match-height">
            <b-col md="12" lg="12">
                <b-card no-body>
                    <b-card-body>
                        <b-row>
                            <b-col cols="3">
                                <b-form-group label="Mã sản phẩm" label-for="h-code">
                                    <b-form-input id="h-code" v-model="code" placeholder="xxx-xxxx-xxx" />
                                </b-form-group>
                            </b-col>
                            <b-col cols="3">
                                <b-form-group label="Người dùng" label-for="h-user">
                                    <b-form-input id="h-user" v-model="user" placeholder="Tên người dùng" />
                                </b-form-group>
                            </b-col>
                            <b-col cols="3">
                                <b-form-group label="Ngày phát hành" label-for="h-released">
                                    <b-form-input type="date" v-model="released_day" id="h-released" placeholder="dd/mm/yyyy" />
                                </b-form-group>
                            </b-col>
                            <b-col cols="3">
                                <b-form-group label="Ngày sử dụng" label-for="h-used">
                                    <b-form-input type="date" v-model="used_day" id="h-used" placeholder="dd/mm/yyyy" />
                                </b-form-group>
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col cols="3">
                                <b-form-group label="Khóa học" label-for="h-used">
                                    <b-form-select
                                        v-model="course_id"
                                        :options="course"
                                    />
                                </b-form-group>
                            </b-col>
                            <b-col cols="9">
                                <b-button style="margin-top: 20px;border: none;float:right;background-color: #7367f0 !important;" @click="fetchDataCode()" >Lọc dữ liệu</b-button>
                                <b-button style="margin-top: 20px;border: none;float:right;background-color: #fa9e43 !important; margin-right:10px" @click="clearFilter()">Hủy lọc</b-button>
                                <router-link to="/product/code/create" class="btn btn-secondary" style="margin-top: 20px;border: none;float:right;background-color: #e44040 !important; margin-right:10px" @click="clearFilter()">Tạo mã</router-link>
                            </b-col>
                        </b-row>
                    </b-card-body>
                </b-card>
            </b-col>
        </b-row>
        <b-row class="match-height">
            <b-col md="12" lg="12">
                <b-card no-body>
                    <b-card-body>
                        <span style="margin-bottom:10px;display:block;">Tổng số: {{ codeList.total }}</span>
                        <b-pagination
                            v-model="page"
                            :total-rows="codeList.total"
                            :per-page="codeList.perPage"
                            @change="changePage"
                            last-number
                        />
                        <div class="table-responsive">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>CODE</th>
                                        <th>USERNAME</th>
                                        <th>NGÀY TẠO</th>
                                        <th>NGÀY SỬ DỤNG</th>
                                        <th width="340"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="code in codeList.data" :key="code.id">
                                        <td><span class="font-weight-bold">{{ code.id }}</span></td>
                                        <td>{{ code.code }}</td>
                                        <td>{{ code.username }}</td>
                                        <td>{{ toDateTime(code.created_at) }}</td>
                                        <td>{{ code.used_at ? toDateTime(code.used_at) : 'Chưa sử dụng' }}</td>
                                        <td>
                                            <!-- <router-link class="edit-product btn btn-warning waves-effect waves-light mr-1" :to="'/course/lesson/' + code.id">Bài giảng</router-link>
                                            <div class="edit-product btn btn-primary waves-effect waves-light mr-1" @click="editItem(code)">Sửa</div>
                                            <div class="edit-delete btn btn-danger waves-effect waves-light" @click="deleteItem(code)">Xóa</div> -->
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <b-pagination
                            v-model="page"
                            :total-rows="codeList.total"
                            :per-page="codeList.perPage"
                            @change="changePage"
                            last-number
                        />
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
  BModal,
  BPagination
} from 'bootstrap-vue';
import useJwt from '@/auth/jwt/useJwt'
import Ripple from 'vue-ripple-directive'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

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
        BPagination
    },
    directives: {
        Ripple,
    },
    data() {
        return {
            course_id: -1,
            codeList: [],
            course: [],
            page: 1,
            code: '',
            released_day: '',
            used_day: '',
            user: '',
            status: -1
        }
    },
    created() {
        this.fetchDataCode()
        this.fetchCourse()
    },
    methods: {
        changePage(page) {
            this.page = page
            this.fetchDataCode()
        },
        clearFilter() {
            this.code = ''
            this.released_day = ''
            this.used_day = ''
            this.user = ''
            this.course_id = -1
            this.fetchDataCode()
        },
        fetchCourse() {
            useJwt.get('/course')
            .then(response => {
                if (response.data.code === 1) {
                    for (let index = 0; index < response.data.data.length; index++) {
                        const element = response.data.data[index];
                        this.course.push({
                            value: element.id,
                            text: `${element.id} - ${element.category_title} - ${element.title}`,
                        })
                    }
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
        fetchDataCode() {
            useJwt.get('/product/get-product-code', {
                params: {
                    page: this.page,
                    code: this.code,
                    released_day: this.released_day,
                    used_day: this.used_day,
                    user: this.user,
                    status: this.status,
                    course_id: this.course_id
                }
            })
            .then(response => {
                if (response.data.code === 1) {
                    this.codeList = response.data.data
                    // this.page = this.codeList.page
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
}
</script>

<style>

</style>