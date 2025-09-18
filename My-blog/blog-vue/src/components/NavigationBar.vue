<template>
  <div class="NavigationBar">
    <ul>
      <router-link
        v-for="(item, index) in navItems"
        :key="index"
        :to="item.path"
        active-class="active"
        class="nav-link"
        >{{ item.title }}</router-link
      >
    </ul>
  </div>
  <div class="ContentBox">
    <router-view></router-view>
  </div>
</template>

<script>
// export default {}
export default {
  name: "NavigationBar",
  data() {
    return {
      navItems: [
        { title: "主页", path: "/HomePage" },
        { title: "动态", path: "/DynamicPage" },
        { title: "小店", path: "/StorePage" },
        { title: "其他", path: "/OtherPage" },
      ],
    };
  },
};
</script>

<style>
@import "NavigationBar.css";
</style>
