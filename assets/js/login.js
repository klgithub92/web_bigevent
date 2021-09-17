$(function () {
  // 点击'去注册'
  $('#link_reg').on('click', function () {
    $('.reg-box').show()
    $('.login-box').hide()
  })

  // 点击'去登录'
  $('#link_login').on('click', function () {
    $('.reg-box').hide()
    $('.login-box').show()
  })

  // 从 layui 中获取form对象
  const form = layui.form
  //  从 layui 中获取 layer提示对象
  const layer = layui.layer
  // 通过form.verify()自定义校验规则
  form.verify({
    // 第一种方式
    pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
    // 第二种方式
    repwd: function (value) {
      // 注意：这里的形参value是加了repwd的文本框输入内容
      // 判断两个密码输入是否相同即可
      let pwd = $('.reg-box [name=password]').val()
      if (pwd !== value) {
        return '两次密码不一致'
      }
    },
  })

  // 监听注册表单的提交事件
  $('#form_reg').on('submit', function (e) {
    // 1.阻止默认提交行为
    e.preventDefault()
    // 2.发起ajax请求
    let data = {
      username: $('.reg-box [name=username]').val(),
      password: $('.reg-box [name=password]').val(),
    }
    $.post('/api/reguser', data, function (res) {
      if (res.status !== 0) return layer.msg(res.message)
      layer.msg('注册成功,请登录')
      // 模拟人的点击行为
      $('#link_login').click()
    })
  })

  // 监听登录表单的提交事件
  $('#form_login').submit(function (e) {
    e.preventDefault()
    $.ajax({
      url: '/api/login',
      method: 'POST',
      // 快速获取表单数据
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('登录失败！')
        }
        // 将登录成功的token字符串保存到本地
        localStorage.setItem('token', res.token)
        // 跳转到后台主页
        location.href = '/index.html'
      },
    })
  })
})
