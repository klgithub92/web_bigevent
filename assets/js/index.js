$(function () {
  // 获取用户信息
  getUserInfo()

  // 点击退出按钮
  $('#logout').on('click', function () {
    layer.confirm('确定要退出吗?', { icon: 3, title: '提示' }, function (index) {
      //do something
      // 1.清除本地token
      localStorage.removeItem('token')
      // 2.跳转到登录页
      location.href = '/login.html'
      // 关闭提示框
      layer.close(index)
    })
  })
})

// 获取用户信息
function getUserInfo() {
  $.ajax({
    method: 'GET',
    url: '/my/userinfo',
    // headers: {
    //   Authorization: localStorage.getItem('token') || '',
    // },
    success: function (res) {
      if (res.status !== 0) {
        return layui.layer.msg('获取用户信息失败')
      }
      // 成功
      // 调用 renderAvatar 渲染用户头像
      renderAvatar(res.data)
    },
    // 不论成功还是失败，最终都会调用complete函数
    // complete函数res.responseJSON可用拿到服务器响应的数据
    // complete: function (res) {
    //   // console.log(res)
    //   if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
    //     // 1.强制清空token 反正用户手写token
    //     localStorage.removeItem('token')
    //     // 2.强制跳转登录页
    //     location.href = '/login.html'
    //   }
    // },
  })
}

// 渲染用户头像函数
function renderAvatar(user) {
  // 1.获取用户名
  let name = user.nickname || user.username
  // 2.设置欢迎文本
  $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
  // 3.按需渲染头像
  if (user.user_pic !== null) {
    // 3.1 渲染图片头像
    $('.layui-nav-img').attr('src', user.user_pic).show()
    $('.text-avatar').hide()
  } else {
    // 3.2 渲染文本头像
    $('.layui-nav-img').hide()
    let first = name[0].toUpperCase()
    $('.text-avatar').html(first).show()
  }
}
