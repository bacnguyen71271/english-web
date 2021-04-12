<template>
    <div>
        <b-row class="match-height">
            <b-col md="12" lg="8">
                <b-card no-body>
                    <b-card-body>
                        <b-card-title>Sửa bài giảng</b-card-title>
                        <b-form>
                            <b-form-group>
                                <label for="email">Tên bài giảng:</label>
                                <b-form-input type="text" v-model="lesson.title" placeholder="Tên bài giảng"/>
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
                                <image-browser type="video" v-model="lesson.baihat"/>
                            </b-form-group>
                            <b-form-group>
                                <label for="password">2. Từ vựng - Phát âm</label>
                                <image-browser type="video" v-model="lesson.tuvung"/>
                            </b-form-group>
                            <b-form-group>
                                <label for="password">3. Sách</label>
                                <div>
                                    <b-row>
                                        <b-col cols="3" v-for="(item, index) in lesson.sach" :key="index">
                                            <div style="display: flex; justify-content: space-between;">
                                                <strong>Page: {{index + 1}}</strong>
                                                <div>
                                                    <span @click="listUp(index)" style="cursor: pointer; font-size: 13px; padding: 5px; color: #796df2;">Lên</span>
                                                    <span @click="listDown(index)" style="cursor: pointer; font-size: 13px; padding: 5px; color: #796df2;">Xuống</span>
                                                    <span @click="deleteItem(index)" style="cursor: pointer; font-size: 13px; padding: 5px; color: #796df2;">Xóa</span>
                                                </div>
                                            </div>
                                            <b-form-group>
                                                <image-browser v-model="item.item"/>
                                            </b-form-group>
                                        </b-col>
                                        <b-button style="margin-top: 20px;border: none;float:right;background-color: #f06767 !important; height: 40px;" @click="bookAddItem()" >Thêm trang</b-button>
                                    </b-row>
                                </div>
                            </b-form-group>
                        </b-form>
                    </b-card-body>
                </b-card>
                <!-- <b-card no-body>
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
                </b-card> -->
            </b-col>
            <b-col md="12" lg="4">
                <b-card no-body>
                    <b-card-body>
                        <!-- <b-row>
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
                        </b-row> -->
                        <b-row>
                            <b-col cols="12">
                                <b-form-group label="Loại bài giảng" label-for="h-used">
                                    <b-form-select v-model="lesson.type" :options="lessonTypeOption"/>
                                </b-form-group>
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col cols="12">
                                <b-form-group>
                                    <label for="password">Ảnh đại diện</label>
                                    <image-browser v-model="lesson.image"/>
                                </b-form-group>
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col cols="12">
                                <b-form-group>
                                    <b-form-checkbox id="checkbox-3" name="checkbox-3" v-model="lesson.status" >
                                        Xuất bản
                                    </b-form-checkbox>
                            </b-form-group>
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col cols="12">
                                <b-button style="margin-top: 20px;border: none;background-color: #fa9e43 !important; margin-right:10px" @click="updateLesson()">LƯU BÀI GIẢNG</b-button>
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
        BPagination,
        ImageBrowser
    },
    directives: {
        Ripple,
    },
    data() {
        return {
            lesson: {
                title: '',
                baihat: '',
                tuvung: '',
                sach: [{
                    item: ''
                }],
                image: '',
                status: 1,
                type: 1,
            },
            lessonTypeOption: [
                { value: 1, text: 'Bài giảng' },
                { value: 2, text: 'Tài liệu' },
            ],
            books: []
        }
    },
    created() {
    },
    methods: {
        deleteItem(id) {
            this.lesson.sach.splice(id, 1)
        },
        listUp(index) {
            this.lesson.sach = this.array_move(this.lesson.sach, index, index - 1);
        },
        listDown(index) {
            this.lesson.sach = this.array_move(this.lesson.sach, index, index + 1);
        },
        array_move(arr, oldIndex, newIndex) {
            arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
            return arr; // for testing
        },
        bookAddItem() {
            if (!this.lesson.sach) { this.lesson.sach = [] }
            this.lesson.sach.push({
                item: ''
            })
        },
        updateLesson() {
            useJwt.post('/lesson', {
                title: this.lesson.title,
                course_id: this.$route.params.course,
                image: this.lesson.image,
                baihat: this.lesson.baihat,
                tuvung: this.lesson.tuvung,
                sach: this.lesson.sach,
                status: this.lesson.status,
                type: this.lesson.type,
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
                    this.$router.push({ 'path': `/course/lesson/${this.$route.params.course}` })
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