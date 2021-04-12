<template>
    <div class="demo-alignment">
        <b-button style="background-color: #7367f0 !important;" @click="popupActive=true" color="primary">Tải lên</b-button>
        <img v-if="value && type != 'video'" style="max-width: 100%;" class="" :src="value" @click="popupActive=true" >
        <video-player v-if="type == 'video'" class="w-100 video-player-box"
            ref="videoPlayer2"
            :options="playerOptions"
            :playsinline="true"
            customEventName="customstatechangedeventname"

            @play="onPlayerPlay($event)"
            @pause="onPlayerPause($event)"
            @ended="onPlayerEnded($event)"
            @waiting="onPlayerWaiting($event)"
            @playing="onPlayerPlaying($event)"
            @loadeddata="onPlayerLoadeddata($event)"
            @timeupdate="onPlayerTimeupdate($event)"
            @canplay="onPlayerCanplay($event)"
            @canplaythrough="onPlayerCanplaythrough($event)"

            @statechanged="playerStateChanged($event)"
            @ready="playerReadied2">
        </video-player>

        <b-modal  id="media-popup" title="Media" v-model="popupActive">
            <b-row>
                <b-col sm="9">
                    <b-row sm="3">
                        <b-button @click="uploadButtonClick()" color="primary" style="margin-left:15px;background-color: #7367f0 !important;">{{ uploadState ? 'Đang tải lên' : 'Tải lên' }}</b-button>
                        <ul style="display: flex; margin: auto; margin-left: 20px;">
                            <li style="cursor: pointer; background-color: #7367f0; color: #fff; padding: 5px 30px; margin-right: 10px;" v-for="(type, index) in typeList" :key="index">{{ type.type }}</li>
                        </ul>
                        <!-- <span>{{ currentStatus }}</span> -->
                        <input hidden multiple type="file" name="file" ref="fileInput" id="" @change="filesChange($event.target.name, $event.target.files);" class="input-file">
                    </b-row>
                    <b-row style="height: 80vh; overflow-y: auto;">
                        <div class="image-item" @click="itemSelect(media), imageView = media, isSelect = media.id" v-for="media in mediaList" :key="media.id" :class="{'active' : isSelect == media.id}">
                            <span v-if="media.type == 'video'" style="font-size: 14px; position: absolute; color: #000;">{{ media.file_name }}</span>
                            <b-button style="background-color: #ef3c3c !important; padding: 15px;" @click="emit(media)">Chọn</b-button>
                            <div class="mask"></div>
                            <img v-if="media.type == 'video'" src="/video-icon.png" class="w-100" />
                            <img v-if="media.type != 'video'" :src="media.src" class="w-100" />
                        </div>
                    </b-row>
                </b-col>
                <b-col sm="3">
                    <b-card no-body>
                        <b-card-body>
                            <b-card-title>Thông tin</b-card-title>
                        </b-card-body>
                        <b-col cols="13" v-if="imageView">
                            <b-form-group label-for="h-code" v-if="!mediaLabelEdit">
                                <span>{{ imageView.file_name }} <button style="border: none; background-color: transparent; color: blue; text-decoration: underline;" @click="mediaLabelEdit = true">Sửa tên media</button></span>
                            </b-form-group>
                             <b-form-group label-for="h-code" v-if="mediaLabelEdit">
                                <b-form-input id="h-code" v-model="imageView.file_name" />
                                <button style="border: none; background-color: transparent; color: blue; text-decoration: underline;" @click="mediaLabelEdit = false, mediaChangeName()">Lưu</button>
                                <button style="border: none; background-color: transparent; color: blue; text-decoration: underline;" @click="mediaLabelEdit = false">Hủy</button>
                            </b-form-group>
                        </b-col>
                        <b-button style="border: none; background: transparent; color: red; text-decoration-line: underline; margin-bottom: 10px;" v-if="imageView" @click="deleteImage(imageView)">Xóa vĩnh viễn</b-button>
                        <img v-if="imageView && imageView.type != 'video'" :src="imageView.src" class="w-100" >
                        <video-player v-if="type == 'video'" class="w-100 video-player-box"
                            ref="videoPlayer"
                            :options="playerOptions"
                            :playsinline="true"
                            customEventName="customstatechangedeventname"

                            @play="onPlayerPlay($event)"
                            @pause="onPlayerPause($event)"
                            @ended="onPlayerEnded($event)"
                            @waiting="onPlayerWaiting($event)"
                            @playing="onPlayerPlaying($event)"
                            @loadeddata="onPlayerLoadeddata($event)"
                            @timeupdate="onPlayerTimeupdate($event)"
                            @canplay="onPlayerCanplay($event)"
                            @canplaythrough="onPlayerCanplaythrough($event)"

                            @statechanged="playerStateChanged($event)"
                            @ready="playerReadied">
                        </video-player>
                        <span style="display: block;margin-top:10px" v-if="imageView">Size: {{ imageView.size }}</span>
                        <span style="display: block;margin-top:10px" v-if="imageView">Đường dẫn: {{ imageView.src }}</span>
                    </b-card>
                </b-col>
            </b-row>
        </b-modal>
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
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import useJwt from '@/auth/jwt/useJwt'

const STATUS_INITIAL = 0
const STATUS_SAVING = 1
const STATUS_SUCCESS = 2
const STATUS_FAILED = 3

export default {
    props: {
        value: {
            type: String,
            default: ''
        },
        type: {
            type: String,
            default: ''
        }
    },
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
    },
    data() {
        return {
            mediaLabelEdit: false,
            isSelect: null,
            popupActive: false,
            page: 1,
            mediaList: [],
            uploadedFiles: [],
            uploadError: null,
            currentStatus: null,
            uploadFieldName: 'file',
            uploadState: false,
            imageView: null,
            selected: null,
            typeList: [],
            mediaTypeSelect: '',
            playerOptions: {
                muted: true,
                language: 'en',
                playbackRates: [0.7, 1.0, 1.5, 2.0],
                poster: "/static/images/author.jpg",
                flash: { hls: { withCredentials: false } },
                html5: { hls: { withCredentials: false } },
            }
        }
    },
    watch: {
        // 'value': function () {
        //     if (this.type === 'video') {
        //         this.playVideo2(`${this.value}/index.m3u8`)
        //     }
        // },
        // player2: (newVal, oldVal) => {
        //   console.log('Prop changed: ', newVal, ' | was: ', oldVal)
        // }
    },
    computed: {
        isInitial() {
            return this.currentStatus === STATUS_INITIAL;
        },
        isSaving() {
            return this.currentStatus === STATUS_SAVING;
        },
        isSuccess() {
            return this.currentStatus === STATUS_SUCCESS;
        },
        isFailed() {
            return this.currentStatus === STATUS_FAILED;
        },
        player() {
            return this.$refs.videoPlayer.player
        },
        player2() {
            return this.$refs.videoPlayer2.player
        }
    },
    methods: {
        mediaChangeName() {
            useJwt.post('media-rename', {
                id: this.isSelect,
                name: this.imageView.file_name
            })
                .then(x => {
                    if (x.data.code === 1) {
                        const index = this.mediaList.findIndex(item => item.id !== this.isSelect)
                        this.mediaList[index].file_name = this.imageView.file_name
                    }
                })
                .catch(err => {
                });
            this.mediaLabelEdit = false
        },
        onPlayerTimeupdate(event) {

        },
        onPlayerCanplaythrough(event) {

        },
        onPlayerWaiting(event) {

        },
        onPlayerPlay(event) {

        },
        onPlayerPlaying(event) {

        },
        onPlayerCanplay(event) {

        },
        onPlayerLoadeddata(event) {

        },
        playVideo(source) {
            const video = {
                withCredentials: false,
                type: 'application/x-mpegurl',
                src: source
            }
            this.player.reset() // in IE11 (mode IE10) direct usage of src() when <src> is already set, generated errors,
            this.player.src(video)
            // this.player.load()
            this.player.play()
        },
        playVideo2(source) {
            const video = {
                withCredentials: false,
                type: 'application/x-mpegurl',
                src: source
            }
            this.player2.reset() // in IE11 (mode IE10) direct usage of src() when <src> is already set, generated errors,
            this.player2.src(video)
            console.log(video)
            // this.player.load()
            this.player2.play()
        },
        onPlayerPause(player) {
            // console.log('player pause!', player)
        },
        playerReadied2(player) {
            if (this.type === 'video' && this.value !== '') {
                this.playVideo2(`${this.value}/0`)
            }
        },
        playerReadied(player) {
            console.log('the player is readied', player)
            // you can use it to do something...
            // player.[methods]
        },
        itemSelect(media) {
            if (this.type === 'video') {
                this.playVideo(`${media.src}/0`)
            }
        },
        deleteImage(imageData) {
            useJwt.post('delete-media', imageData)
            .then(res => {
                if (res.data.code) {
                    this.mediaList = this.mediaList.filter(item => item.id !== imageData.id)
                    this.imageView = null
                }
            })
            .catch(err => {
            });
        },
        emit(media) {
            this.$emit('input', media.src)
            if (this.type === 'video') {
                this.playVideo2(`${this.value}/0`)
            }
            this.selected = media
            this.popupActive = false
        },
        reset() {
            // reset form to initial state
            this.currentStatus = STATUS_INITIAL;
            this.uploadedFiles = [];
            this.uploadError = null;
        },
        save(formData) {
            // upload data to the server
            this.currentStatus = STATUS_SAVING;

            useJwt.post('upload', formData)
                .then(response => {
                    if (response.data.code === 1) {
                        if (response.data.data) {
                            for (let index = 0; index < response.data.data.length; index++) {
                                const element = response.data.data[index];
                                this.mediaList.unshift(element);
                            }
                        }
                        this.currentStatus = STATUS_SUCCESS;
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
                .catch(err => {
                    this.uploadError = err.response;
                    this.currentStatus = STATUS_FAILED;
                });
        },
        filesChange(fieldName, fileList) {
            // Add file to buffer
            const formData = new FormData();

            if (!fileList.length) return;

            for (let index = 0; index < fileList.length; index++) {
                const element = fileList[index];
                formData.append(fieldName, element, element.name);
            }
            // save it
            this.save(formData);
        },
        uploadButtonClick() {
            this.$refs.fileInput.click()
        },
        fetchMediaType() {
            const self = this
            useJwt.get('/get-media-type')
            .then(response => {
                if (response.data.code === 1) {
                    if (response.data.data) {
                        self.typeList = response.data.data
                        if (self.typeList.length > 0) {
                            self.mediaTypeSelect = self.typeList[0]
                        }
                        self.fetchMedia()
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
        fetchMedia() {
            const self = this
            useJwt.get('/get-media', {
                params: {
                    page: self.page,
                    type: self.type
                }
            })
            .then(response => {
                if (response.data.code === 1) {
                    if (response.data.data) {
                        for (let index = 0; index < response.data.data.data.length; index++) {
                            const element = response.data.data.data[index];
                            self.mediaList.push(element)
                        }
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
            .catch(error => {
            })
        }
    },
    created() {
        this.fetchMedia()
    },
    mounted() {
        this.reset();
    }
}
</script>

<style>
.image-item {
    width: 150px;
    height: 150px;
    box-shadow: 0px 0px 5px 0px #00000038;
    border-radius: 5px;
    cursor: pointer;
    margin: 5px 10px;
    transition: all 0.2 ease;
    position: relative;
}

.image-item:hover {
    box-shadow: 0px 0px 10px 2px #00000038;
}

.image-item img {
    width: 100%;
    border-radius: 5px;
    max-height: 100%;
}

.image-item button {
    z-index: 2;
    display: none;
    opacity: 0;
    position: absolute;
    border: none;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #fff;
    background-color: #0172bc;
    padding: 6px;
    border-radius: 9px;
    box-shadow: 0px 0px 1px 1px #dbdbdbbd;
}

.image-item .mask {
    width: 100%;
    height: 100%;
    position: absolute;
    border-radius: 5px;
    background-color: #0000002a;
    opacity: 0;
    transition: all .2s;
}

.image-item:hover .mask {
    opacity: 1;
}

.image-item:hover button {
    display: block;
    opacity: 1;
}

.image-item.active {
    border: 4px solid #0172bc;
}

#media-popup.modal {
  padding: 25px !important;
}
#media-popup.modal .modal-dialog {
  width: 100%;
  max-width: none;
  height: 100%;
  margin: 0;
}
#media-popup.modal .modal-content {
  height: 100%;
  border: 0;
  border-radius: 0;
}
#media-popup.modal .modal-body {
  overflow-y: auto;
}

.video-player>div {
    width: 100%;
}

</style>