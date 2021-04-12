<template>
    <div>
        <b-row class="match-height">
            <b-col md="12" lg="12">
                <b-card no-body>
                    <b-card-body>
                        <b-row>
                            <b-col cols="6">
                                <b-form-group label="Khóa học áp dụng" label-for="h-used">
                                    <b-form-select
                                        v-model="course_id"
                                        :options="course"
                                        :select-size="6"
                                        multiple
                                    />
                                </b-form-group>
                            </b-col>
                            <b-col cols="3">
                                <b-form-group label="Số lượng" label-for="h-code">
                                    <b-form-input id="h-code" v-model="amount" placeholder="Số lượng mã muốn tạo" />
                                </b-form-group>
                            </b-col>
                            <b-col cols="3">
                                <b-button style="margin-top: 20px;border: none;float:right;background-color: #e44040 !important; margin-right:10px" @click="createCode()">Tạo mã</b-button>
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
                        <div>
                            <span style="display: block;" v-for="(c, index) in codeList" :key="index">{{ c }}</span>
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
  BPagination,
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
        BFormTextarea
    },
    directives: {
        Ripple,
    },
    data() {
        return {
            course_id: [],
            codeList: [],
            course: [],
            amount: 0,
            productCode: ''
        }
    },
    created() {
        this.fetchCourse()
    },
    methods: {
        createCode() {
            if (this.course_id.length === 0) {
                this.$toast({
                    component: ToastificationContent,
                    props: {
                    title: 'Error',
                    icon: 'BellIcon',
                    text: 'Bạn hãy chọn ít nhất 1 khóa học',
                    variant: 'danger',
                    },
                })
                return
            }

            if (!Number(this.amount) || Number(this.amount) === 0) {
                this.$toast({
                    component: ToastificationContent,
                    props: {
                    title: 'Error',
                    icon: 'BellIcon',
                    text: 'Số lượng phải lớn hơn 0',
                    variant: 'danger',
                    },
                })
                return
            }
            this.$bvModal
            .msgBoxConfirm(`Bạn chắc chắn muốn tạo mã với các tùy chọn này ?`, {
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
                    useJwt.post('/product/create-product-code', {
                        course_id: this.course_id,
                        amount: Number(this.amount)
                    })
                    .then(response => {
                        if (response.data.code === 1) {
                            this.codeList = response.data.data
                            this.$toast({
                                component: ToastificationContent,
                                props: {
                                title: 'Thông báo !',
                                icon: 'BellIcon',
                                text: 'Mã của bạn đã được tạo thành công',
                                variant: 'success',
                                },
                            })
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
    }
}
</script>

<style>

</style>