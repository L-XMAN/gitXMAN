<template>
    <div class="MessageBox">
        <div class="AddMessageBox">
            <div class="addM">
                <textarea v-model="text" type="text" placeholder="输入留言"></textarea>
            </div>
            <div class="buttonBox">
                <button @click="setM">留&emsp;言</button>
            </div>
        </div>
        <div class="MessageTextBox">
            <div class="MessageText" v-for="Messages in Message">
                <div class="Mtext">{{ Messages.message }}</div>
                <div class="messageTimeBox">{{ Messages.time }}</div>
            </div>
        </div>
    </div>
</template>



<script>
import axios from 'axios';

export default {
    data() {
        return {
            text: '',
            Message: [
            ]
        }
    },

    mounted() {

    },

    methods: {

        //获取数据库留言
        getMessage() {
            axios.get("http://127.0.0.1:8000/getmessage", {
                params: {},
                headers: {}
            }).then((res) => {
                this.Message = res.data,
                    console.log(res.data)
            })
        },

        setM() {  //这个按钮绑定的添加留言函数
            axios.post("http://127.0.0.1:8000/setmessage", { text: this.text })
                .then(response => {
                    this.addMessages = response.data;
                    this.text = '';
                    this.getMessage();
                })
                .catch(error => {
                    console.error(error);
                    this.addMessages = 'Error saving text';
                });
            // this.Message = this.originalArray.reverse();
        },

    },
    created() {
        this.getMessage()
    },
}

</script>

<style scoped>
@import 'Message.css';
/* @import 'src/vue.js'; */
</style>