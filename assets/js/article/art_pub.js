$(function () {
  let layer = layui.layer
  let form = layui.form
  // 文章类别数据
  initCate()
  // 初始化富文本编辑器
  initEditor()

  // 初始化文章类别
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('初始化文章类别失败')
        }
        // 使用模板引擎渲染UI
        let htmlStr = template('tpl-cate', res)
        $('[name=cate_id]').html(htmlStr)
        // 因为是动态添加的模板引擎，所有要调用render
        form.render()
      },
    })
  }

  // 1. 初始化图片裁剪器
  var $image = $('#image')

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview',
  }
  // 3. 初始化裁剪区域
  $image.cropper(options)

  // 为选择封面的按钮绑定事件处理函数
  $('#btnChooseImage').on('click', function () {
    $('#coverFile').click()
  })

  // 1.监听选择文件框的change事件
  $('#coverFile').on('change', function (e) {
    // 2.拿到用户选择的文件
    var files = e.target.files
    // 判断用户是否选择了文件
    if (files.length === 0) return
    // 3.根据选择的文件，创建一个对应的 URL 地址
    var newImgURL = URL.createObjectURL(files[0])
    // 4.先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`
    $image
      .cropper('destroy') // 销毁旧的裁剪区域
      .attr('src', newImgURL) // 重新设置图片路径
      .cropper(options) // 重新初始化裁剪区域
  })

  // 定义文章的默认状态
  let art_state = '已发布'

  // 给存为草稿绑定事件 修改状态
  $('#btnSave2').on('click', function () {
    art_state = '草稿'
  })

  // 为表单绑定submit事件
  $('#form-pub').on('submit', function (e) {
    // 1.阻止默认的表单提交行为
    e.preventDefault()
    // 2.基于form表单快速创建一个FormDate对象
    let fd = new FormData($(this)[0]) // 转换为原生js
    // 3.将文件状态，存到fd中
    fd.append('state', art_state)

    // 4.将裁剪后的图片，输出为文件
    $image
      .cropper('getCroppedCanvas', {
        // 创建一个 Canvas 画布
        width: 400,
        height: 280,
      })
      .toBlob(function (blob) {
        // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        // 5.将裁剪后的图片存到fd中
        fd.append('cover_img', blob)
        // 6.发起ajax请求 发布文章
        // fd.forEach((k, v) => {
        //   console.log(k, v)
        // })
        publishArticle(fd)
      })
  })

  // 发布文章的方法
  function publishArticle(fd) {
    $.ajax({
      method: 'POST',
      url: '/my/article/add',
      data: fd,
      // 注意：如果向服务器提交的是 FormDate 格式的数据，必须添加下面两个配置
      processData: false, //  告诉jquery不要处理发送的数据
      contentType: false, // 告诉jquery不要设置content-Type请求头
      success: function (res) {
        if (res.status !== 0) return layer.msg('发布文章失败!')
        layer.msg('发布文章成功！')
        // 发布草稿后跳转到列表页面
        location.href = '/article/art_list.html'
      },
    })
  }
})
