// interceptors/fetch.ts
import fetchIntercept from 'fetch-intercept'

// 注册拦截器
const unregister = fetchIntercept.register({
  request: (url, config) => {
    const token = localStorage.getItem('token') // 或从你自己的状态管理中取

    // 自动加上 Authorization header
    // config.headers = {
    //   ...(config.headers || {}),
    //   'Authorization': token ? `Bearer ${token}` : '',
    //   'Content-Type': 'application/json',
    // }

    return [url, config]
  },

  response: (response) => {
    if (response.status === 401) {
      // 可选：跳转登录、弹窗提示等
      window.location.href = '/login'
    }

    return response
  },

  responseError: (error) => {
    console.error('全局请求异常:', error)
    return Promise.reject(error)
  }
})

// 可导出 unregister，在不需要拦截时调用
export { unregister }
