<template>
    <div class="BigBox">
        <div class="NavigationBox">
            <div class="LogoBox">
                <img src="../assets/logo.svg" alt="SVG Image" width=100% height=100%>
            </div>
            <div class="NavigationBar">
                <ul>
                    <li>
                        <router-link active-class="hover"
                            :to="{ name: 'Photoalbum' }">摄影集</router-link>
                    </li>
                    <li>
                        <router-link active-class="hover" :to="{ name: 'AboutMe' }">关于我</router-link>
                    </li>
                    <li>
                        <router-link active-class="hover" :to="{ name: 'Message' }">留&emsp;言</router-link>
                    </li>
                </ul>
            </div>
            <div class="ContactBox">
                <div class="WeChatSmallContactBox">
                    <i class="iconfont icon-weixin"></i>
                    <div class="WeChat">
                        <img src="../assets/QR code/Wechat.png" alt="" width="75PX">
                    </div>
                </div>
                <div class="QQSmallContactBox">
                    <i class="iconfont icon-QQ"></i>
                    <div class="QQ">
                        <img src="../assets/QR code/QQ.jpg" alt="" width="75px">
                    </div>
                </div>
                <div class="EmaillSmallContactBox">
                    <i class="iconfont icon-youxiang"></i>
                    <div class="Email">
                        <img src="../assets/QR code/Emaill.png" alt="" width="75px">
                    </div>
                </div>
            </div>
        </div>
        <div class="ContentBar">
            <router-view></router-view>
        </div>
    </div>
</template>



<script>
export default {
    data() {
        return {
            list: []
        }
    },
    methods: {
        
    }
}

</script>




<style scoped>
@import 'HomePage.css';
</style>