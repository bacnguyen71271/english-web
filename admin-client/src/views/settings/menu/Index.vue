<template>
    <div>
        <b-row class="match-height">
            <b-col md="12" lg="12">
                <b-card no-body>
                    <b-card-body>
                        <div class="table-responsive">
                            <router-link class="mb-2 edit-product btn btn-warning waves-effect waves-light mr-1" :to="'/settings/menu/add'">Thêm menu mới</router-link>
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>TITLE</th>
                                        <th>VỊ TRÍ</th>
                                        <th>TRẠNG THÁI</th>
                                        <th width="340"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="item in menuList" :key="item.id">
                                        <td><span class="font-weight-bold">{{ item.id }}</span></td>
                                        <td>{{ item.title }}</td>
                                        <td>{{ item.location }}</td>
                                        <td>{{ item.status == 1 ? 'Mở' : 'Đóng' }}</td>
                                        <td>
                                            <router-link class="edit-product btn btn-warning waves-effect waves-light mr-1" :to="'/settings/menu/edit/' + item.id">Sửa</router-link>
                                            <div class="edit-delete btn btn-danger waves-effect waves-light" @click="deleteItem(item.id)">Xóa</div>
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
            menuList: null
        }
    },
    created() {
        this.fetchDataMenu()
    },
    methods: {
        deleteItem(menuId) {
            this.$bvModal
            .msgBoxConfirm(`Xác nhận xóa ?`, {
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
                    useJwt.delete('/menu', {
                        params: {
                            id: menuId
                        }
                    })
                    .then(response => {
                        if (response.data.code === 1) {
                            this.$toast({
                                component: ToastificationContent,
                                props: {
                                title: 'Thông báo !',
                                icon: 'BellIcon',
                                text: 'Thành công',
                                variant: 'success',
                                },
                            })
                            this.fetchDataMenu()
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
        fetchDataMenu() {
            useJwt.get('/menu')
            .then(response => {
                if (response.data.code === 1) {
                    this.menuList = response.data.data
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