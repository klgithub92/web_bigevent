$(function () {
  let form = layui.form
  let layer = layui.layer
  // 配置验证规则
  form.verify({
    nickname: function (value) {
      if (value.length > 6) {
        return '昵称长度必须在1~6个之间'
      }
    },
  })

  // 获取用户信息
  getUserInfo()

  // 获取用户信息
  function getUserInfo() {
    $.ajax({
      method: 'GET',
      url: '/my/userinfo',
      success(res) {
        if (res.status !== 0) {
          return layer.msg('获取用户信息失败')
        }
        // console.log(res.data)
        // 使用form.val()快速为表单赋值
        form.val('formUserInfo', res.data)
      },
    })
  }

  // 点击重置按钮
  $('#btnReset').on('click', function (e) {
    // 阻止表单默认的重置行为
    e.preventDefault()
    getUserInfo()
  })

  // 监听表单提交修改事件
  $('.layui-form').on('submit', function (e) {
    e.preventDefault() // 阻止表单默认提交行为
    $.ajax({
      method: 'POST',
      url: '/my/userinfo',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('修改用户信息失败')
        }
        layer.msg(res.message)
        // 调用父页面的方法，从新渲染用户和头像信息
        // 子页面调父页面的函数通过window.parent
        window.parent.getUserInfo()
      },
    })
  })
})
