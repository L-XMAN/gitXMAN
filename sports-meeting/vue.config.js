const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,

  devServer: {
    port: 8081,  // 改为目标端口号
    open: true,  // 可选：启动时自动打开浏览器
  },
  // publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  // 或者直接设置为相对路径
  publicPath: './'
})

// module.exports = {
//   lintOnSave: false  // 修改成false 就是不检查了
// }