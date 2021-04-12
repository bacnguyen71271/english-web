<template>
    <div>
        <b-row class="match-height">
            <b-col md="12" lg="8">
                <b-card no-body>
                    <b-card-body>
                        <b-card-title>Sửa menu</b-card-title>
                        <div>
                            <b-form-group label="Tiêu đề menu" label-for="h-code">
                                <b-form-input v-model="menuInfo.title" placeholder="Tiêu đề" />
                            </b-form-group>
                        </div>
                    </b-card-body>
                </b-card>
                <b-card no-body>
                    <b-card-body>
                        <b-card-title>Sửa menu</b-card-title>
                        <div>
                            <b-row class="mt-1" style="border-bottom: 1px solid #d3d3d3" v-for="(item, index) in menuData" :key="index">
                                <b-col cols="5">
                                    <b-form-group label="Tiêu đề" label-for="h-code">
                                        <b-form-input v-model="item.title" placeholder="Tiêu đề" />
                                    </b-form-group>
                                </b-col>
                                <b-col cols="5">
                                    <b-form-group label="Đường dẫn" label-for="h-user">
                                        <b-form-input v-model="item.link" placeholder="Đường dẫn" />
                                    </b-form-group>
                                </b-col>
                                <b-col cols="12">
                                    <div @click="listUp(index)" class="btn" style="color: #ff7800">Lên</div>
                                    <div @click="listDown(index)" class="btn" style="color: #494de0">Xuống</div>
                                    <div @click="deleteItem(index)" class="btn" style="color: #e04949">Xóa</div>
                                </b-col>
                            </b-row>
                            <b-button style="margin-top: 20px;border: none;float:right;background-color: #7367f0 !important;" @click="addBlock()" >Thêm block</b-button>
                        </div>
                    </b-card-body>
                </b-card>
            </b-col>
            <b-col md="12" lg="4">
                <b-card no-body>
                    <b-card-body>
                        <b-row>
                            <b-col cols="12">
                                <b-form-group label="Vị trí menu" label-for="h-used">
                                    <b-form-select v-model="menuInfo.location" :options="locationOption"/>
                                </b-form-group>
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col cols="12">
                                <b-form-group label="Trạng thái" label-for="h-used">
                                    <b-form-select v-model="menuInfo.status" :options="statusOption"/>
                                </b-form-group>
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col cols="12">
                                <b-button style="margin-top: 20px;border: none;background-color: #fa9e43 !important; margin-right:10px" @click="menuSave">LƯU MENU</b-button>
                            </b-col>
                        </b-row>
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
            menuInfo: {
                title: '',
                status: 1,
                location: ''
            },
            menuData: [{
                title: '',
                link: ''
            }],
            statusOption: [
                { value: 1, text: 'Mở' },
                { value: 2, text: 'Đóng' },
            ],
            locationOption: [
                { value: 'menu-top', text: 'Menu Top' },
                { value: "menu-footer", text: 'Menu Footer' },
            ]
        }
    },
    created() {
    },
    methods: {
        deleteItem(id) {
            this.menuData.splice(id, 1)
        },
        listUp(index) {
            this.menuData = this.array_move(this.menuData, index, index - 1);
        },
        listDown(index) {
            this.menuData = this.array_move(this.menuData, index, index + 1);
        },
        array_move(arr, oldIndex, newIndex) {
            arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
            return arr; // for testing
        },
        addBlock() {
            this.menuData.push({
                title: '',
                link: ''
            })
        },
        menuSave() {
            useJwt.post('/menu', {
                title: this.menuInfo.title,
                data: this.menuData,
                location: this.menuInfo.location,
                status: this.menuInfo.status,
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
    }
}
</script>

<style>

</style>