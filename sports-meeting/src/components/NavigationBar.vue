<template>
  <title>校园运动会后台管理系统</title>
  <div class="TopBar">
    <div class="Title">校园运动会后台管理系统</div>
  </div>
  <div class="BigBox">
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
      <!-- <el-menu
        default-active="2"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
      >
        <el-sub-menu index="1">
          <template #title>
            <span>页面管理</span>
          </template>
          <el-menu-item index="1-1">轮播图</el-menu-item>
          <el-menu-item index="1-2">通知公告</el-menu-item>
          <el-menu-item index="1-3">宣传资讯</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="2">
          <template #title>
            <span>成绩管理</span>
          </template>
          <el-menu-item index="2-1" >修改成绩</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="3">
          <template #title>
            <span>赛事管理</span>
          </template>
          <el-menu-item index="3-1">创建比赛项目</el-menu-item>
          <el-menu-item index="3-2">编辑比赛项目</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="4">
          <template #title>
            <span>用户管理</span>
          </template>
          <el-menu-item index="4-1">账号列表</el-menu-item>
          <el-menu-item index="4-2">添加账号</el-menu-item>
          <el-menu-item index="4-3">修改账号</el-menu-item>
        </el-sub-menu>
      </el-menu> -->
    </div>
    <div class="ContentBox">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: "NavigationBar",
  data() {
    return {
      navItems: [
        { title: "系统管理", path: "/SystemManagement" },
        { title: "赛事管理", path: "/EventManagement" },
        { title: "用户管理", path: "/UserManagement" },
      ],
    };
  },
};
</script>

<style scoped>
@import "NavigationBar.css";
</style>