import axios from 'axios'
import { ElMessage } from 'element-plus' // 假设使用 Element Plus 作为 UI 库
import { useRouter } from 'vue-router'

// 创建 axios 实例
const service = axios.create({
    // baseURL: import.meta.env.VITE_API_BASE_URL, // 从环境变量获取基础 URL
    baseURL:"/api",
    timeout: 10000, // 请求超时时间
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    }
})

// 请求拦截器
service.interceptors.request.use(
    (config) => {
        // 在请求发送前做些什么，例如添加 token
        // const token = localStorage.getItem('token')
        const token = "eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjczNzU4MDczMTY0LCJ1c2VySWQiOjd9.Fq8kS-cqFkgR-nDUmjbwozlvMstv7Bg1PPYRavJe_Tk"
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        // 处理请求错误
        console.error('请求拦截器错误:', error)
        return Promise.reject(error)
    }
)

// 响应拦截器
service.interceptors.response.use(
    (response) => {
        // 对响应数据做点什么
        const res = response.data

        // 假设后端约定：code 为 0 表示成功
        if (res.code !== 1) {
            ElMessage.error(res.message || '操作失败')
            return Promise.reject(new Error(res.message || 'Error'))
        }

        return res
    },
    (error) => {
        // 处理响应错误
        console.error('响应错误:', error)

        // 处理不同错误状态码
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    ElMessage.error('身份验证失败，请重新登录')
                    // 清除 token 并跳转到登录页
                    localStorage.removeItem('token')
                    const router = useRouter()
                    router.push('/login')
                    break
                case 403:
                    ElMessage.error('没有权限执行该操作')
                    break
                case 404:
                    ElMessage.error('请求的资源不存在')
                    break
                case 500:
                    ElMessage.error('服务器内部错误')
                    break
                default:
                    ElMessage.error(`请求错误: ${error.response.status}`)
            }
        } else if (error.message.includes('timeout')) {
            ElMessage.error('请求超时，请稍后重试')
        } else if (error.message.includes('Network Error')) {
            ElMessage.error('网络错误，请检查网络连接')
        } else {
            ElMessage.error('请求失败，请稍后重试')
        }

        return Promise.reject(error)
    }
)

// 封装常用请求方法
export const request = {
    get(url, params = {}) {
        return service.get(url, { params })
    },

    post(url, data = {}) {
        return service.post(url, data)
    },

    put(url, data = {}) {
        return service.put(url, data)
    },

    delete(url, params = {}) {
        return service.delete(url, { params })
    }
}

export default service
