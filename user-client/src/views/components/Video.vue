<template>
    <div>
        <video-player class="w-100 video-player-box"
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
    </div>
</template>

<script>
export default {
    props: {
        src: {
            type: String,
            default: ''
        },
        img: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
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
    computed: {
        player() {
            return this.$refs.videoPlayer.player
        },
    },
    methods: {
        onPlayerCanplaythrough(player) {},
        onPlayerCanplay(player) {},
        onPlayerWaiting(player) {},
        onPlayerPlaying(player) {},
        onPlayerPlay(player) {},
        onPlayerLoadeddata(player) {},
        onPlayerTimeupdate(player) {},
        playerReadied(player) {
            console.log('the player is readied', player)
            this.playVideo(`${this.src}/0`, this.img)
        },
        playVideo(source, image) {
            const video = {
                withCredentials: false,
                type: 'application/x-mpegurl',
                src: source
            }
            this.player.reset()
            this.player.src(video)
            this.player.poster(image)
            // this.player.play()
            // this.player.pause()
        },
    }
}
</script>

<style>
.video-js {
    width: 800px;
    height: 450px;
}
</style>