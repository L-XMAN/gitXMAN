<template>
    <div class="PhotoalbumBox">
        <div class="PhotoFramesli" v-for="photos in photo">
            <div class="photo">
                <img class="photo" :src="'http://localhost:8000/image?file=D:/PHOTO/' + photos.Photo" alt="">
            </div>
        </div>
    </div>
</template>


<script>
import axios from 'axios';

export default {
    data() {
        return {
            photo: [],
        }
    },
    methods: {
        getPhoto() {
            axios.get("http://127.0.0.1:8000/getphoto", {
                params: {},
                headers: {}
            }).then((res) => {
                this.photo = res.data,
                    console.log(res.data);
            })
        },
    },
    created() {
        this.getPhoto()
    },
}
</script>


<style scoped>
@import 'Photoalbum.css';
</style>