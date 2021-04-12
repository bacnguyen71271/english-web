<template>
  <b-row class="match-height">
    <b-col md="6" lg="4">
      <b-card no-body>
        <b-card-body>
          <b-card-title>Thêm danh mục mới</b-card-title>
          <b-form @submit.prevent>
            <b-row>
              <b-col cols="12">
                <b-form-group label="Tiêu đề" label-for="v-first-name">
                  <b-form-input id="v-first-name" placeholder="Tiêu đề" v-model="form_title" />
                </b-form-group>
              </b-col>
              <b-col cols="12">
                <b-form-group label="Danh mục cha" label-for="v-email">
                    <b-form-select
                        v-model="form_categoryValue"
                        :options="categoryOption"
                        :select-size="6"
                    />
                </b-form-group>
              </b-col>
              <b-col cols="12">
                <b-form-group>
                    <label for="password">Ảnh đại diện</label>
                    <image-browser v-model="courseImage"/>
                </b-form-group>
              </b-col>
              <!-- checkbox -->
              <b-col cols="12">
                <b-form-group>
                  <b-form-checkbox
                    id="checkbox-3"
                    name="checkbox-3"
                    v-model="form_status"
                  >
                    Xuất bản
                  </b-form-checkbox>
                </b-form-group>
              </b-col>

              <!-- submit and reset -->
              <b-col cols="12">
                <b-button v-ripple.400="'rgba(255, 255, 255, 0.15)'" type="button" @click="editAction" variant="primary" class="mr-1" >Lưu</b-button>
                <b-button v-if="editStatus" v-ripple.400="'rgba(186, 191, 199, 0.15)'" type="button" variant="outline-secondary" @click="resetForm" >Hủy</b-button>
              </b-col>
            </b-row>
          </b-form>
        </b-card-body>
      </b-card>
    </b-col>
    <b-col md="6" lg="8">
        <b-card no-body>
            <b-card-body>
                <table class="table">
                    <thead>
                    <tr>
                        <th width="">TÊN DANH MỤC</th>
                        <th>ĐƯỜNG DẪN</th>
                        <th>TRẠNG THÁI</th>
                        <th width="215"></th>
                    </tr>
                    </thead>
                    <tbody>
                        <tr v-for="cate in convertCategory(category)" :key="cate.value">
                            <td style="white-space: nowrap;">{{ cate.text }}</td>
                            <td><a target="_blank" :href="`https://edusing123.com/danh-muc/${toSlug(cate.text)}-${cate.value}`">{{ `https://edusing123.com/danh-muc/${toSlug(cate.text)}-${cate.value}` }}</a></td>
                            <td>{{ cate.status ? "Mở" : "Đóng" }}</td>
                            <td>
                                <div class="edit-product btn btn-primary waves-effect waves-light mr-1" @click="editItem(cate)">Sửa</div>
                                <div class="edit-delete btn btn-danger waves-effect waves-light" @click="deleteItem(cate)">Xóa</div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </b-card-body>
        </b-card>
    </b-col>
  </b-row>
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
  BFormSelect
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
        ImageBrowser
    },
    directives: {
        Ripple,
    },
    data() {
        return {
            categoryOption: null,
            form_categoryValue: 0,
            category: null,
            form_title: '',
            form_status: true,
            editStatus: false,
            idEdit: null,
            courseImage: ''
        }
    },
    created() {
        this.fetchCategory()
    },
    methods: {
        editItem(category) {
            debugger
            this.form_title = category.title
            this.form_categoryValue = category.parent_id
            this.form_status = (category.status === 1 ? true : false)
            this.editStatus = true
            this.idEdit = category.value
            this.courseImage = category.image
        },
        deleteItem(category) {
            this.$bvModal
            .msgBoxConfirm(`Bạn muốn xóa danh mục ${category.text}`, {
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
                    useJwt.delete(`/course/category`, {
                        data: {
                            id: category.value
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
                            this.resetForm()
                            this.fetchCategory()
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
        resetForm() {
            this.form_title = ''
            this.form_categoryValue = 0
            this.form_status = true
            this.editStatus = false
            this.courseImage = ''
        },
        editAction() {
            let request = null
            if (this.editStatus) {
                request = useJwt.put('/course/category', {
                    id: this.idEdit,
                    parent_id: this.form_categoryValue,
                    title: this.form_title,
                    status: this.form_status,
                    image: this.courseImage
                })
            } else {
                request = useJwt.post('/course/category', {
                    parent_id: this.form_categoryValue,
                    title: this.form_title,
                    status: this.form_status,
                    image: this.courseImage
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
                    this.fetchCategory()
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
                        parent_id: element.parent_id,
                        image: element.image
                        })

                    for (let index2 = 0; index2 < element.childs.length; index2++) {
                        const element2 = element.childs[index2];
                        data.push({
                            value: element2.id,
                            text: `---| ${element2.title}`,
                            status: element2.status,
                            title: element2.title,
                            parent_id: element2.parent_id,
                            image: element2.image
                            })

                        for (let index3 = 0; index3 < element2.childs.length; index3++) {
                            const element3 = element2.childs[index3];
                            data.push({
                                value: element3.id,
                                text: `------| ${element3.title}`,
                                status: element3.status,
                                title: element3.title,
                                parent_id: element3.parent_id,
                                image: element3.image
                            })
                        }
                    }
                }
            }
            return data
        }
    }
};
</script>

<style>
</style>