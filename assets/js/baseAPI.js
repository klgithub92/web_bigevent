// 注意:在每次请求ajax时都会调用这个函数$.ajaxPrefilter()
$.ajaxPrefilter(function (options) {
  // 在发起真正的ajax之前，统一拼接配置对象
  options.url = 'http://api-breakingnews-web.itheima.net' + options.url
  // options.url = 'http://127.0.0.1:3007' + options.url

  // 统一为有权限的接口配置headers请求头
  if (options.url.indexOf('/my/') !== -1) {
    options.headers = {
      Authorization: localStorage.getItem('token') || '',
    }
  }
  // 不论成功还是失败，最终都会调用complete函数
  // complete函数res.responseJSON可用拿到服务器响应的数据
  // 全局统一的挂载complete函数
  options.complete = function (res) {
    if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
      // 1.强制清空token 反正用户手写token
      localStorage.removeItem('token')
      // 2.强制跳转登录页
      location.href = '/login.html'
    }
  }
})
