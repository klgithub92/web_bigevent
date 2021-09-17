// 注意:在每次请求ajax时都会调用这个函数$.ajaxPrefilter()
$.ajaxPrefilter(function (options) {
  // 在发起真正的ajax之前，统一拼接配置对象
  options.url = 'http://api-breakingnews-web.itheima.net' + options.url
})
