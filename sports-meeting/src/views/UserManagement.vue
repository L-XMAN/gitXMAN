<template>
  <div class="user-management">
    <h2 class="page-title">用户列表</h2>

    <!-- 搜索区域 -->
    <div class="search-bar">
      <input
        type="text"
        v-model="searchName"
        placeholder="输入用户名搜索..."
        class="search-input"
        @keyup.enter="searchUsers"
      />
      <button @click="searchUsers" class="search-btn">搜索</button>
      <button @click="resetSearch" class="reset-btn">重置</button>
      <button @click="switchToAddMode" class="add-btn">新增用户</button>
    </div>

    <!-- 用户列表表格 -->
    <div class="table-wrapper">
      <table class="user-table">
        <thead>
          <tr>
            <th>用户ID</th>
            <th>用户名</th>
            <th>性别</th>
            <th>登录密码</th>
            <th>电话号码</th>
            <th>年级</th>
            <th>班级</th>
            <th>账号状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in currentPageUsers" :key="user.id" class="table-row">
            <td>{{ user.id }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.gender === "male" ? "男" : "女" }}</td>
            <td>{{ maskPassword(user.password) }}</td>
            <td>{{ user.phone }}</td>
            <td>{{ user.grade }}</td>
            <td>{{ user.class }}</td>
            <td>
              <span
                :class="
                  user.status === 1 ? 'status-enabled' : 'status-disabled'
                "
              >
                {{ user.status === 1 ? "启用" : "禁用" }}
              </span>
            </td>
            <td class="action-cell">
              <button
                @click="toggleStatus(user.id)"
                :class="user.status === 1 ? 'disable-btn' : 'enable-btn'"
              >
                {{ user.status === 1 ? "禁用" : "启用" }}
              </button>
              <button @click="editUser(user)" class="edit-btn">编辑</button>
              <button @click="deleteUser(user.id)" class="delete-btn">
                删除
              </button>
            </td>
          </tr>
          <tr v-if="currentPageUsers.length === 0">
            <td colspan="9" class="no-data">没有找到匹配的用户</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 分页控制 -->
    <div class="pagination" v-if="totalPages > 0">
      <button
        @click="changePage(1)"
        :disabled="currentPage === 1"
        class="page-btn"
      >
        首页
      </button>
      <button
        @click="changePage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="page-btn"
      >
        上一页
      </button>
      <span class="page-info">
        第 {{ currentPage }} 页 / 共 {{ totalPages }} 页
      </span>
      <button
        @click="changePage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="page-btn"
      >
        下一页
      </button>
      <button
        @click="changePage(totalPages)"
        :disabled="currentPage === totalPages"
        class="page-btn"
      >
        末页
      </button>
    </div>

    <!-- 表单区域 (新增或编辑) -->
    <div class="form-container" v-if="showForm">
      <div class="form-header">
        <h2 class="form-title">{{ isEditing ? "编辑用户" : "新增用户" }}</h2>
        <button @click="cancelForm" class="form-close-btn">关闭</button>
      </div>

      <form @submit.prevent="submitForm" class="user-form">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">用户名:</label>
            <input
              type="text"
              v-model="formData.username"
              required
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label class="form-label">密码:</label>
            <input
              type="password"
              v-model="formData.password"
              :required="!isEditing"
              class="form-input"
              placeholder="编辑时不填则保持不变"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">性别:</label>
            <div class="radio-group">
              <label class="radio-option">
                <input type="radio" v-model="formData.gender" value="male" />
                男
              </label>
              <label class="radio-option">
                <input type="radio" v-model="formData.gender" value="female" />
                女
              </label>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">电话号码:</label>
            <input
              type="tel"
              v-model="formData.phone"
              required
              class="form-input"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">年级:</label>
            <input
              type="text"
              v-model="formData.grade"
              required
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label class="form-label">班级:</label>
            <input
              type="text"
              v-model="formData.class"
              required
              class="form-input"
            />
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="submit-btn">
            {{ isEditing ? "更新" : "添加" }}
          </button>
          <button type="button" @click="cancelForm" class="cancel-btn">
            取消
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 搜索相关
      searchName: "",

      // 用户数据
      users: [
        // {
        //   id: 1,
        //   username: "",
        //   gender: "",
        //   password: "",
        //   phone: "",
        //   grade: "",
        //   class: "",
        //   status: '',
        // },
        
      ],
      filteredUsers: [],

      // 分页相关
      currentPage: 1,
      pageSize: 5,

      // 表单相关
      showForm: false,
      isEditing: false,
      formData: {
        id: null,
        username: "",
        password: "",
        gender: "",
        phone: "",
        grade: "",
        class: "",
      },

      /*------------------------------------*/
      // 加载状态
      loading: false,

      // 通知消息
      notification: {
        show: false,
        type: "success",
        message: "",
      },
    };
  },
  /*------------------------------------*/
  computed: {
    // 当前页显示的用户
    currentPageUsers() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      return this.filteredUsers.slice(startIndex, startIndex + this.pageSize);
    },

    // 总页数
    totalPages() {
      return Math.ceil(this.filteredUsers.length / this.pageSize);
    },
  },

  /*------------------------------------*/
  created() {
    // 组件创建时获取用户列表
    this.fetchUsers();
  },
  /*------------------------------------*/

  created() {
    // 初始化过滤后的用户列表
    this.filteredUsers = [...this.users];
  },

  methods: {
    // 显示通知消息
    showNotification(message, type = "success") {
      this.notification.message = message;
      this.notification.type = type;
      this.notification.show = true;

      // 3秒后自动隐藏
      setTimeout(() => {
        this.notification.show = false;
      }, 3000);
    },

    // 获取用户列表
    async fetchUsers() {
      this.loading = true;
      try {
        // 这里使用模拟的API，实际项目中替换为真实API
        const response = await axios.get(`/administrator/query`);

        // 模拟API响应延迟
        // await new Promise((resolve) => setTimeout(resolve, 1000));

        // 模拟API响应数据
        // const mockUsers = [
        //   {
        //     id: 1,
        //     username: "张三",
        //     gender: "male",
        //     password: "zhangsan123",
        //     phone: "13800138000",
        //     grade: "高一",
        //     class: "1班",
        //     status: 1,
        //   }
        // ];

        // this.users = mockUsers;
        // this.filteredUsers = [...mockUsers];

        this.users = response;
        this.filteredUsers = [...response];

        this.showNotification("用户数据加载成功");
      } catch (error) {
        console.error("获取用户列表失败:", error);
        this.showNotification("获取用户列表失败，请重试", "error");
      } finally {
        this.loading = false;
      }
    },

    // 搜索用户
    searchUsers() {
      if (!this.searchName.trim()) {
        this.filteredUsers = [...this.users];
      } else {
        const query = this.searchName.trim().toLowerCase();
        this.filteredUsers = this.users.filter((user) =>
          user.username.toLowerCase().includes(query)
        );
      }
      // 重置到第一页
      this.currentPage = 1;
    },

    // 重置搜索
    resetSearch() {
      this.searchName = "";
      this.searchUsers();
    },

    // 改变页码
    changePage(page) {
      if (page < 1 || page > this.totalPages) return;
      this.currentPage = page;
    },

    // 切换用户状态（启用/禁用）
    async toggleStatus(userId) {
      const user = this.users.find((u) => u.id === userId);
      if (user) {
        const newStatus = user.status === 1 ? 0 : 1;
        const actionText = newStatus === 1 ? "启用" : "禁用";

        if (confirm(`确定要${actionText}用户"${user.username}"吗？`)) {
          this.loading = true;
          try {
            // 实际项目中调用API更新状态
            await axios.put(`/administrator/status/'+'user.status'+'/{userid}'`, { status: newStatus });

            // 模拟API请求
            // await new Promise((resolve) => setTimeout(resolve, 500));

            // 更新本地数据
            user.status = newStatus;
            this.searchUsers(); // 刷新列表

            this.showNotification(`用户已${actionText}`);
          } catch (error) {
            console.error("更新用户状态失败:", error);
            this.showNotification(`${actionText}用户失败，请重试`, "error");
          } finally {
            this.loading = false;
          }
        }
      }
    },

    // 删除用户
    async deleteUser(userId) {
      const userIndex = this.users.findIndex((u) => u.id === userId);
      if (userIndex !== -1) {
        const userName = this.users[userIndex].username;
        if (confirm(`确定要删除用户"${userName}"吗？此操作不可恢复。`)) {
          this.loading = true;
          try {
            // 实际项目中调用API删除用户
            await axios.delete(`/administrator/delectuser/{userid}`);

            // 模拟API请求
            // await new Promise((resolve) => setTimeout(resolve, 500));

            // 更新本地数据
            this.users.splice(userIndex, 1);
            this.searchUsers(); // 刷新列表

            // 如果删除后当前页没有数据且不是第一页，则返回上一页
            if (this.currentPageUsers.length === 0 && this.currentPage > 1) {
              this.currentPage--;
            }

            this.showNotification("用户删除成功");
          } catch (error) {
            console.error("删除用户失败:", error);
            this.showNotification("删除用户失败，请重试", "error");
          } finally {
            this.loading = false;
          }
        }
      }
    },

    // 切换到新增模式
    switchToAddMode() {
      this.showForm = true;
      this.isEditing = false;
      // 重置表单
      this.formData = {
        id: null,
        username: "",
        password: "",
        gender: "male",
        phone: "",
        grade: "",
        class: "",
      };

      // 滚动到表单位置
      this.scrollToForm();
    },

    // 编辑用户
    editUser(user) {
      this.showForm = true;
      this.isEditing = true;
      // 填充表单数据
      this.formData = {
        id: user.id,
        username: user.username,
        password: "", // 密码不显示，编辑时不填则保持不变
        gender: user.gender,
        phone: user.phone,
        grade: user.grade,
        class: user.class,
      };

      // 滚动到表单位置
      this.scrollToForm();
    },

    // 取消表单操作
    cancelForm() {
      this.showForm = false;
    },

    // 提交表单（新增或编辑）
    async submitForm() {
      this.loading = true;
      try {
        if (this.isEditing) {
          // 编辑操作
          // 实际项目中调用API更新用户
          await axios.put(`/user/updatainfo${this.formData.id}`, this.formData);

          // 模拟API请求
          // await new Promise((resolve) => setTimeout(resolve, 800));

          const userIndex = this.users.findIndex(
            (u) => u.id === this.formData.id
          );
          if (userIndex !== -1) {
            // 保留原密码（如果没填写新密码）
            if (!this.formData.password) {
              this.formData.password = this.users[userIndex].password;
            }

            // 更新用户数据
            this.users[userIndex] = {
              ...this.users[userIndex],
              ...this.formData,
              // 状态保持不变
              status: this.users[userIndex].status,
            };

            this.showNotification("用户更新成功");
          }
        } else {
          // 新增操作
          // 实际项目中调用API添加用户
          const response = await axios.post(`/basic/register`, this.formData);

          // 模拟API请求
          await new Promise((resolve) => setTimeout(resolve, 800));

          // 生成新ID
          const newId = Math.max(...this.users.map((u) => u.id), 0) + 1;

          // 创建新用户对象
          const newUser = {
            ...this.formData,
            id: newId,
            status: 1, // 新用户默认为启用状态
          };

          // 添加到用户列表
          this.users.push(newUser);
          this.showNotification("用户添加成功");
        }

        // 刷新列表
        this.searchUsers();
        // 关闭表单
        this.showForm = false;
      } catch (error) {
        console.error("保存用户失败:", error);
        this.showNotification("保存用户失败，请重试", "error");
      } finally {
        this.loading = false;
      }
    },

    // 密码掩码处理
    maskPassword(password) {
      if (password.length <= 4) {
        return "*".repeat(password.length);
      }
      return (
        password.substring(0, 2) +
        "*".repeat(password.length - 4) +
        password.substring(password.length - 2)
      );
    },

    // 滚动到表单位置
    scrollToForm() {
      this.$nextTick(() => {
        const formElement = document.querySelector(".form-container");
        if (formElement) {
          formElement.scrollIntoView({ behavior: "smooth" });
        }
      });
    },
  },

  // methods: {
  //   // 搜索用户
  //   searchUsers() {
  //     if (!this.searchName.trim()) {
  //       this.filteredUsers = [...this.users];
  //     } else {
  //       const query = this.searchName.trim().toLowerCase();
  //       this.filteredUsers = this.users.filter((user) =>
  //         user.username.toLowerCase().includes(query)
  //       );
  //     }
  //     // 重置到第一页
  //     this.currentPage = 1;
  //   },

  //   // 重置搜索
  //   resetSearch() {
  //     this.searchName = "";
  //     this.searchUsers();
  //   },

  //   // 改变页码
  //   changePage(page) {
  //     if (page < 1 || page > this.totalPages) return;
  //     this.currentPage = page;
  //   },

  //   // 切换用户状态（启用/禁用）
  //   toggleStatus(userId) {
  //     const user = this.users.find((u) => u.id === userId);
  //     if (user) {
  //       const newStatus = user.status === 1 ? 0 : 1;
  //       const actionText = newStatus === 1 ? "启用" : "禁用";

  //       if (confirm(`确定要${actionText}用户"${user.username}"吗？`)) {
  //         user.status = newStatus;
  //         this.searchUsers(); // 刷新列表
  //       }
  //     }
  //   },

  //   // 删除用户
  //   deleteUser(userId) {
  //     const userIndex = this.users.findIndex((u) => u.id === userId);
  //     if (userIndex !== -1) {
  //       const userName = this.users[userIndex].username;
  //       if (confirm(`确定要删除用户"${userName}"吗？此操作不可恢复。`)) {
  //         this.users.splice(userIndex, 1);
  //         this.searchUsers(); // 刷新列表

  //         // 如果删除后当前页没有数据且不是第一页，则返回上一页
  //         if (this.currentPageUsers.length === 0 && this.currentPage > 1) {
  //           this.currentPage--;
  //         }
  //       }
  //     }
  //   },

  //   // 切换到新增模式
  //   switchToAddMode() {
  //     this.showForm = true;
  //     this.isEditing = false;
  //     // 重置表单
  //     this.formData = {
  //       id: null,
  //       username: "",
  //       password: "",
  //       gender: "male",
  //       phone: "",
  //       grade: "",
  //       class: "",
  //     };

  //     // 滚动到表单位置
  //     this.scrollToForm();
  //   },

  //   // 编辑用户
  //   editUser(user) {
  //     this.showForm = true;
  //     this.isEditing = true;
  //     // 填充表单数据
  //     this.formData = {
  //       id: user.id,
  //       username: user.username,
  //       password: "", // 密码不显示，编辑时不填则保持不变
  //       gender: user.gender,
  //       phone: user.phone,
  //       grade: user.grade,
  //       class: user.class,
  //     };

  //     // 滚动到表单位置
  //     this.scrollToForm();
  //   },

  //   // 取消表单操作
  //   cancelForm() {
  //     this.showForm = false;
  //   },

  //   // 提交表单（新增或编辑）
  //   submitForm() {
  //     if (this.isEditing) {
  //       // 编辑操作
  //       const userIndex = this.users.findIndex(
  //         (u) => u.id === this.formData.id
  //       );
  //       if (userIndex !== -1) {
  //         // 保留原密码（如果没填写新密码）
  //         if (!this.formData.password) {
  //           this.formData.password = this.users[userIndex].password;
  //         }

  //         // 更新用户数据
  //         this.users[userIndex] = {
  //           ...this.users[userIndex],
  //           ...this.formData,
  //           // 状态保持不变
  //           status: this.users[userIndex].status,
  //         };

  //         alert("用户更新成功！");
  //       }
  //     } else {
  //       // 新增操作
  //       // 生成新ID
  //       const newId = Math.max(...this.users.map((u) => u.id), 0) + 1;

  //       // 创建新用户对象
  //       const newUser = {
  //         ...this.formData,
  //         id: newId,
  //         status: 1, // 新用户默认为启用状态
  //       };

  //       // 添加到用户列表
  //       this.users.push(newUser);
  //       alert("用户添加成功！");
  //     }

  //     // 刷新列表
  //     this.searchUsers();
  //     // 关闭表单
  //     this.showForm = false;
  //   },

  //   // 密码掩码处理
  //   maskPassword(password) {
  //     if (password.length <= 4) {
  //       return "*".repeat(password.length);
  //     }
  //     return (
  //       password.substring(0, 2) +
  //       "*".repeat(password.length - 4) +
  //       password.substring(password.length - 2)
  //     );
  //   },

  //   // 滚动到表单位置
  //   scrollToForm() {
  //     this.$nextTick(() => {
  //       const formElement = document.querySelector(".form-container");
  //       if (formElement) {
  //         formElement.scrollIntoView({ behavior: "smooth" });
  //       }
  //     });
  //   },
  // },
};
</script>
<style scoped>
@import "UserManagement.css";
</style>
