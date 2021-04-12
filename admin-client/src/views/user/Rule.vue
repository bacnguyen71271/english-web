<template>
    <div>
        <b-modal @ok="createRule" size="lg" id="modal-login" cancel-variant="outline-secondary" ok-title="Submit" cancel-title="Cancel" centered title="Thêm vai trò" v-model="showRuleAddModal" >
            <b-form>
                <b-form-group>
                    <label for="username">Tên vai trò:</label>
                    <b-form-input type="text" v-model="role_name" placeholder="Tên vai trò"/>
                </b-form-group>
                <b-form-group>
                    <label for="username">Mô tả:</label>
                    <b-form-textarea type="text" v-model="role_description" placeholder="mô tả vai trò" rows="4"/>
                </b-form-group>
            </b-form>
        </b-modal>
        <b-modal @ok="addUser" size="lg" id="modal-login" cancel-variant="outline-secondary" ok-title="Submit" cancel-title="Cancel" centered title="Thêm người dùng vào role" v-model="showUserAddModal" >
            <b-form>
                <b-form-group>
                    <label for="username">Username:</label>
                    <b-form-input type="text" v-model="username" placeholder="Username"/>
                </b-form-group>
            </b-form>
        </b-modal>
        <b-row class="match-height">
            <b-col md="12" lg="4">
                <b-card no-body>
                    <b-card-body>
                        <b-card-title class="mb-1 font-weight-bold" title-tag="h2">Vai trò</b-card-title>
                        <b-button style="border: none;float:right;background-color: #7367f0 !important;" @click="showRuleAddModal = true, role_name = '', role_description = ''" >Thêm mới</b-button>
                        <b-row class="match-height w-100 p-0 pt-2 m-0">
                            <ul class="p-0 w-100" style="list-style: none;">
                                <li @click="roleSelect = item, fetchDataUserByRole()" style="background-color: rgb(239, 238, 250); padding: 10px; width: 100%; cursor: pointer; margin-bottom: 10px; display: flex; justify-content: space-between;" v-for="(item, index) in roleList" :key="index"><span>{{ item.name }}</span><span @click="roleDelete(item.id)" style="color: #0321ff;">Xóa vai trò</span></li>
                            </ul>
                        </b-row>
                    </b-card-body>
                </b-card>
            </b-col>
            <b-col md="12" lg="8">
                <b-card no-body>
                    <b-card-body>
                        <b-card-title class="mb-1 font-weight-bold" title-tag="h2">{{ roleSelect.name }}</b-card-title>
                        <b-tabs content-class="mt-1">
                            <b-tab title="NGƯỜI DÙNG">
                                <!-- <b-pagination
                                    v-model="page"
                                    :total-rows="codeList.total"
                                    :per-page="codeList.perPage"
                                    @change="changePage"
                                    last-number
                                /> -->
                                <b-button v-if="roleSelect.name" style="border: none;float:right;background-color: #7367f0 !important;" @click="showUserAddModal = true" >Thêm người dùng</b-button>
                                <div class="table-responsive mt-1 pt-1">
                                    <table class="table">
                                        <thead>
                                            <tr>
                                                <th>STT</th>
                                                <th>Username</th>
                                                <th>Thao tác</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(item, index) in listUser" :key="index">
                                                <td><span class="font-weight-bold">{{ index + 1 }}</span></td>
                                                <td>{{ item.user_name }}</td>
                                                <td>
                                                    <b-button style="border: none;float:right;background-color: #7367f0 !important;" @click="deleteUserRole(item.user_name)" >Xóa vai trò</b-button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </b-tab>
                            <b-tab title="CẤU HÌNH QUYỀN" lazy>
                                <b-alert variant="danger" show class="mb-0">
                                    <div class="alert-body">
                                        Lựa chọn các hành động có thể thực hiện bởi vai trò sau đó nhấn nút lưu để hoàn thành tạo quyền
                                    </div>
                                </b-alert>
                                <b-button v-if="roleSelect.name" style="border: none;float:right;background-color: #7367f0 !important;" @click="permissionCheck(false)" >Bỏ tất cả</b-button>
                                <b-button v-if="roleSelect.name" style="border: none;float:right;background-color: #7367f0 !important;" @click="permissionCheck(true)" >Chọn tất cả</b-button>
                                <table v-if="roleSelect.name" class="table b-table mt-2">
                                    <thead>
                                        <tr>
                                        <th>Module</th>
                                        <th>View</th>
                                        <th>Add</th>
                                        <th>Edit</th>
                                        <th>Delete</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr class="row-highlights">
                                            <td colpan="3">DASHBOARD</td>
                                            <td><b-form-checkbox v-model="permistion['dashboard-login']"/></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                        <tr class="row-highlights">
                                            <td colpan="3">MEDIA</td>
                                            <td><b-form-checkbox v-model="permistion['media-view']"/></td>
                                            <td><b-form-checkbox v-model="permistion['media-add']"/></td>
                                            <td><b-form-checkbox v-model="permistion['media-edit']"/></td>
                                            <td><b-form-checkbox v-model="permistion['media-delete']"/></td>
                                        </tr>
                                        <tr class="row-highlights">
                                            <td colpan="3">MEDIA</td>
                                            <td><b-form-checkbox v-model="permistion['menu-view']"/></td>
                                            <td><b-form-checkbox v-model="permistion['menu-add']"/></td>
                                            <td><b-form-checkbox v-model="permistion['menu-edit']"/></td>
                                            <td><b-form-checkbox v-model="permistion['menu-delete']"/></td>
                                        </tr>
                                        <tr class="row-highlights">
                                            <td colpan="3">KHÓA HỌC</td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>Danh mục khóa học</td>
                                            <td><b-form-checkbox v-model="permistion['course-category-view']"/></td>
                                            <td><b-form-checkbox v-model="permistion['course-category-add']"/></td>
                                            <td><b-form-checkbox v-model="permistion['course-category-edit']"/></td>
                                            <td><b-form-checkbox v-model="permistion['course-category-delete']"/></td>
                                        </tr>
                                        <tr>
                                            <td>Khóa học</td>
                                            <td><b-form-checkbox v-model="permistion['course-list-view']"/></td>
                                            <td><b-form-checkbox v-model="permistion['course-list-add']"/></td>
                                            <td><b-form-checkbox v-model="permistion['course-list-edit']"/></td>
                                            <td><b-form-checkbox v-model="permistion['course-list-delete']"/></td>
                                        </tr>
                                        <tr>
                                            <td>Bài giảng</td>
                                            <td><b-form-checkbox v-model="permistion['lesson-view']"/></td>
                                            <td><b-form-checkbox v-model="permistion['lesson-add']"/></td>
                                            <td><b-form-checkbox v-model="permistion['lesson-edit']"/></td>
                                            <td><b-form-checkbox v-model="permistion['lesson-delete']"/></td>
                                        </tr>
                                        <tr class="row-highlights">
                                            <td colpan="3">SẢN PHẨM</td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>Mã sản phẩm</td>
                                            <td><b-form-checkbox v-model="permistion['product-view']"/></td>
                                            <td><b-form-checkbox v-model="permistion['product-add']"/></td>
                                            <td><b-form-checkbox v-model="permistion['product-edit']"/></td>
                                            <td><b-form-checkbox v-model="permistion['product-delete']"/></td>
                                        </tr>
                                        <tr class="row-highlights">
                                            <td colpan="3">NGƯỜI DÙNG</td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>Danh sách người dùng</td>
                                            <td><b-form-checkbox v-model="permistion['user-list-view']"/></td>
                                            <td><b-form-checkbox v-model="permistion['user-list-add']"/></td>
                                            <td><b-form-checkbox v-model="permistion['user-list-edit']"/></td>
                                            <td><b-form-checkbox v-model="permistion['user-list-delete']"/></td>
                                        </tr>
                                        <tr>
                                            <td>Phân quyền</td>
                                            <td><b-form-checkbox v-model="permistion['permission-view']"/></td>
                                            <td><b-form-checkbox v-model="permistion['permission-add']"/></td>
                                            <td><b-form-checkbox v-model="permistion['permission-edit']"/></td>
                                            <td><b-form-checkbox v-model="permistion['permission-delete']"/></td>
                                        </tr>
                                    </tbody>
                                </table>
                                <b-button v-if="roleSelect.name" style="border: none;float:right;background-color: #7367f0 !important;" @click="updatePermission()" >Cập nhật</b-button>
                            </b-tab>
                        </b-tabs>
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
  BPagination,
  BTabs,
  BTab,
  BAlert,
  BFormTextarea
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
        BPagination,
        BTabs,
        BTab,
        BAlert,
        BFormTextarea
    },
    directives: {
        Ripple,
    },
    data() {
        return {
            username: '',
            role_name: '',
            roleSelect: {
                name: '',
                id: null
            },
            listUser: [],
            role_description: '',
            roleList: [],
            permistion: {
                'dashboard-login': false,
                'course-category-view': false,
                'course-category-add': false,
                'course-category-edit': false,
                'course-category-delete': false,
                'course-list-view': false,
                'course-list-add': false,
                'course-list-edit': false,
                'course-list-delete': false,
                'lesson-view': false,
                'lesson-add': false,
                'lesson-edit': false,
                'lesson-delete': false,
                'product-view': false,
                'product-add': false,
                'product-edit': false,
                'product-delete': false,
                'user-list-view': false,
                'user-list-add': false,
                'user-list-edit': false,
                'user-list-delete': false,
                'permission-view': false,
                'permission-add': false,
                'permission-edit': false,
                'permission-delete': false,
                'media-view': false,
                'media-add': false,
                'media-edit': false,
                'media-delete': false,
                'menu-view': false,
                'menu-add': false,
                'menu-edit': false,
                'menu-delete': false,
            },
            showRuleAddModal: false,
            showUserAddModal: false
        }
    },
    created() {
        this.fetchDataRole()
    },
    methods: {
        permissionCheck(value) {
            const self = this
            Object.keys(this.permistion).forEach(key => {
                self.permistion[key] = value
            })
        },
        updatePermission() {
            this.$bvModal
            .msgBoxConfirm(`Lưu các thay đổi ?`, {
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
                    useJwt.post('auth/permission-update', {
                        role_id: this.roleSelect.id,
                        permistion: this.permistion
                    })
                    .then(response => {
                        if (response.data.code === 1) {
                            this.$toast({
                                component: ToastificationContent,
                                props: {
                                title: 'Thông báo !',
                                icon: 'BellIcon',
                                text: response.data.message,
                                variant: 'success',
                                },
                            })
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
        },
        roleDelete(id) {
            this.$bvModal
            .msgBoxConfirm(`Xóa vai trò này`, {
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
                    useJwt.post('auth/role-delete', {
                        role_id: id,
                    })
                    .then(response => {
                        if (response.data.code === 1) {
                            this.$toast({
                                component: ToastificationContent,
                                props: {
                                title: 'Thông báo !',
                                icon: 'BellIcon',
                                text: response.data.message,
                                variant: 'success',
                                },
                            })
                            this.fetchDataRole()
                            this.roleSelect = {
                                name: '',
                                id: null
                            }
                            this.listUser = []
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
        },
        deleteUserRole(username) {
            this.$bvModal
            .msgBoxConfirm(`Xác nhân xóa người dùng ${username} ?`, {
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
                    useJwt.post('auth/role-delete-user', {
                        role_id: this.roleSelect.id,
                        username
                    })
                    .then(response => {
                        if (response.data.code === 1) {
                            this.$toast({
                                component: ToastificationContent,
                                props: {
                                title: 'Thông báo !',
                                icon: 'BellIcon',
                                text: response.data.message,
                                variant: 'success',
                                },
                            })
                            this.fetchDataUserByRole()
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
        },
        fetchDataUserByRole() {
            useJwt.post('auth/user-get-list', {
                role_id: this.roleSelect.id,
            })
            .then(response => {
                if (response.data.code === 1) {
                    this.listUser = response.data.data
                    this.fetchDataPermisson()
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
        fetchDataPermisson() {
            const self = this
            useJwt.post('auth/permission-get', {
                role_id: this.roleSelect.id,
            })
            .then(response => {
                if (response.data.code === 1) {
                    Object.keys(this.permistion).forEach(key => {
                        self.permistion[key] = false
                    })

                    for (let index = 0; index < response.data.data.length; index++) {
                        const element = response.data.data[index];
                        this.permistion[element.child] = true
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
        fetchDataRole() {
            useJwt.post('auth/role-get-list', {
                role_id: this.roleSelect.id,
            })
            .then(response => {
                if (response.data.code === 1) {
                    this.roleList = response.data.data
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
        createRule() {
            this.$bvModal
            .msgBoxConfirm(`Tạo vai trò này ?`, {
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
                    useJwt.post('auth/create-role', {
                        role_name: this.role_name,
                        role_description: this.role_description
                    })
                    .then(response => {
                        if (response.data.code === 1) {
                            this.$toast({
                                component: ToastificationContent,
                                props: {
                                title: 'Thông báo !',
                                icon: 'BellIcon',
                                text: response.data.message,
                                variant: 'success',
                                },
                            })
                            this.roleList.push(response.data.data)
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
        },
        addUser() {
            this.$bvModal
            .msgBoxConfirm(`Thêm người dùng này ?`, {
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
                    useJwt.post('auth/role-add-user', {
                        username: this.username,
                        role_id: this.roleSelect.id
                    })
                    .then(response => {
                        if (response.data.code === 1) {
                            this.$toast({
                                component: ToastificationContent,
                                props: {
                                title: 'Thông báo !',
                                icon: 'BellIcon',
                                text: response.data.message,
                                variant: 'success',
                                },
                            })
                            this.fetchDataUserByRole()
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
    }
}
</script>

<style>
tr.row-highlights {
    background-color: #d9e5ef;
}
</style>