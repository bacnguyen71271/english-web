<template>
    <div>
        <b-modal @ok="createUserAction" size="lg" id="modal-login" cancel-variant="outline-secondary" ok-title="Submit" cancel-title="Cancel" centered title="Thêm người dùng" v-model="showAddModal" >
            <b-form>
                <b-form-group>
                    <label for="username">Tên đăng nhập:</label>
                    <b-form-input v-if="modalMode == 'add'" type="text" v-model="create_username" placeholder="Tên đăng nhập"/>
                    <span class="w-100 d-flex" v-if="modalMode == 'edit'">{{ create_username }}</span>
                </b-form-group>
                <b-form-group>
                    <label for="fullname">Họ tên:</label>
                    <b-form-input type="text" v-model="create_fullname" placeholder="Họ tên"/>
                </b-form-group>
                <b-form-group>
                    <label for="email">Email:</label>
                    <b-form-input type="text" v-model="create_email" placeholder="Email"/>
                </b-form-group>
                <b-form-group>
                    <label for="password">Mật khẩu:</label>
                    <b-form-input type="text" v-model="create_password" placeholder="Nhập mật khẩu"/>
                </b-form-group>
            </b-form>
        </b-modal>
        <b-row class="match-height">
            <b-col md="12" lg="12">
                <b-card no-body>
                    <b-card-body>
                        <b-row>
                            <b-col cols="3">
                                <b-form-group label="Tên đăng nhập" label-for="h-code">
                                    <b-form-input id="h-code" v-model="username" placeholder="Tên đăng nhập" />
                                </b-form-group>
                            </b-col>
                            <b-col cols="3">
                                <b-form-group label="Email" label-for="h-user">
                                    <b-form-input id="h-user" v-model="email" placeholder="Email" />
                                </b-form-group>
                            </b-col>
                            <b-col cols="6">
                                <b-button style="margin-top: 20px;border: none;float:right;background-color: #7367f0 !important;" @click="fetchDataUser()" >Lọc dữ liệu</b-button>
                                <b-button style="margin-top: 20px;border: none;float:right;background-color: #fa9e43 !important; margin-right:10px" @click="clearFilter()">Hủy lọc</b-button>
                                <b-button style="margin-top: 20px;border: none;float:right;background-color: #fa9e43 !important; margin-right:10px" @click="showAddModal=true, modalMode = 'add'">Thêm người dùng</b-button>
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
                        <span style="margin-bottom:10px;display:block;">Tổng số: {{ userList.total }}</span>
                        <b-pagination
                            v-model="page"
                            :total-rows="userList.total"
                            :per-page="userList.perPage"
                            @change="changePage"
                            last-number
                        />
                        <div class="table-responsive">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>USERNAME</th>
                                        <th>EMAIL</th>
                                        <th>FULLNAME</th>
                                        <th>CREATED</th>
                                        <th width="340"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="usr in userList.data" :key="usr.id">
                                        <td><span class="font-weight-bold">{{ usr.id }}</span></td>
                                        <td>{{ usr.username }}</td>
                                        <td>{{ usr.email }}</td>
                                        <td>{{ usr.fullname }}</td>
                                        <td>{{ toDateTime(usr.created_at) }}</td>
                                        <td>
                                            <!-- <router-link class="edit-product btn btn-warning waves-effect waves-light mr-1" :to="'/course/lesson/' + code.id">Bài giảng</router-link> -->
                                            <div class="edit-product btn btn-primary waves-effect waves-light mr-1" @click="editItem(usr)">Sửa</div>
                                            <div class="edit-delete btn btn-danger waves-effect waves-light" @click="deleteItem(usr)">Xóa</div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <b-pagination
                            v-model="page"
                            :total-rows="userList.total"
                            :per-page="userList.perPage"
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
            userList: null,
            username: '',
            email: '',
            page: 1,
            showAddModal: false,
            create_username: '',
            create_email: '',
            create_password: '',
            create_fullname: '',
            modalMode: 'add',
            editID: -1
        }
    },
    created() {
        this.fetchDataUser()
    },
    methods: {
        editItem(user) {
            this.create_username = user.username
            this.create_email = user.email
            this.create_password = ''
            this.create_fullname = user.fullname
            this.editID = user.id
            this.modalMode = 'edit'
            this.showAddModal = true
        },
        createUserAction() {
            if (this.modalMode === 'add') {
                this.$bvModal
                .msgBoxConfirm(`Tạo user này ?`, {
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
                        useJwt.post('auth/create-user', {
                            username: this.create_username,
                            email: this.create_email,
                            password: this.create_password,
                            fullname: this.create_fullname
                        })
                        .then(response => {
                            if (response.data.code === 1) {
                                this.$toast({
                                    component: ToastificationContent,
                                    props: {
                                    title: 'Thông báo !',
                                    icon: 'BellIcon',
                                    text: 'Tạo user thành công',
                                    variant: 'success',
                                    },
                                })
                                this.fetchDataUser()
                            } else {
                                this.showAddModal = true
                                this.$toast({
                                    component: ToastificationContent,
                                    props: {
                                    title: 'Error',
                                    icon: 'BellIcon',
                                    text: response.data.message,
                                    variant: 'danger',
                                    },
                                })
                            }
                        })
                    }
                })
            }

            if (this.modalMode === 'edit') {
                this.$bvModal
                .msgBoxConfirm(`Xác nhận sửa ?`, {
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
                        useJwt.post('auth/update-user', {
                            username: this.create_username,
                            email: this.create_email,
                            password: this.create_password,
                            fullname: this.create_fullname,
                            id: this.editID
                        })
                        .then(response => {
                            if (response.data.code === 1) {
                                this.$toast({
                                    component: ToastificationContent,
                                    props: {
                                    title: 'Thông báo !',
                                    icon: 'BellIcon',
                                    text: 'Cập nhật user thành công',
                                    variant: 'success',
                                    },
                                })
                                this.fetchDataUser()
                            } else {
                                this.showAddModal = true
                                this.$toast({
                                    component: ToastificationContent,
                                    props: {
                                    title: 'Error',
                                    icon: 'BellIcon',
                                    text: response.data.message,
                                    variant: 'danger',
                                    },
                                })
                            }
                        })
                    }
                })
            }
        },
        changePage(page) {
            this.page = page
            this.fetchDataUser()
        },
        clearFilter() {
            this.page = 1
            this.username = ''
            this.email = ''
            this.fetchDataUser()
        },
        fetchDataUser() {
            useJwt.get('/users', {
                params: {
                    page: this.page,
                    username: this.username,
                    email: this.email
                }
            })
            .then(response => {
                if (response.data.code === 1) {
                    this.userList = response.data.data
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