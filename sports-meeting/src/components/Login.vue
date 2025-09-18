<template>
  <div class="LoginBg">
    <div class="loginbox"></div>
  </div>
</template>

<script>
export default {
  name: 'LoginPage',
  data() {
    return {
      form: {
        username: '',
        password: '',
        remember: false
      },
      showPassword: false,
      isSubmitting: false,
      touched: {
        username: false,
        password: false
      },
      errors: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    // 验证单个字段
    validateField(field) {
      this.touched[field] = true;
      this.errors[field] = '';
      
      if (field === 'username' && !this.form.username.trim()) {
        this.errors.username = '请输入用户名';
      }
      
      if (field === 'password') {
        if (!this.form.password) {
          this.errors.password = '请输入密码';
        } else if (this.form.password.length < 6) {
          this.errors.password = '密码长度不能少于6位';
        }
      }
    },
    
    // 验证所有字段
    validateForm() {
      let isValid = true;
      
      // 验证用户名
      this.validateField('username');
      if (this.errors.username) isValid = false;
      
      // 验证密码
      this.validateField('password');
      if (this.errors.password) isValid = false;
      
      return isValid;
    },
    
    // 处理登录
    async handleLogin() {
      if (!this.validateForm()) return;
      
      this.isSubmitting = true;
      
      try {
        // 模拟登录请求
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // 登录成功后的处理
        console.log('登录成功', this.form);
        
        // 这里可以添加路由跳转逻辑
        // this.$router.push('/dashboard');
        
        // 显示成功消息
        alert('登录成功！');
      } catch (error) {
        console.error('登录失败', error);
        alert('登录失败，请检查用户名和密码');
      } finally {
        this.isSubmitting = false;
      }
    }
  }
}
</script>

<style scoped>
    @import "Login.css";
</style>
