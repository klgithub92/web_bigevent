$(function () {
  let layer = layui.layer
  let form = layui.form
  // 获取文章分类的列表
  initArtCateList()

  // 获取文章分类的列表
  function initArtCateList() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取文章分类列表失败')
        }
        let htmlStr = template('tmp-table', res)
        // 渲染UI
        $('tbody').html(htmlStr)
      },
    })
  }

  let indexAdd = null
  // 为添加列表按钮绑定事件
  $('#btnAddCate').on('click', function () {
    indexAdd = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '添加文章分类',
      content: $('#dialog-add').html(),
    })
  })

  // 因为他弹窗是动态添加的所有只能使用事件代理(委托)方式提交表单
  $('body').on('submit', '#form-add', function (e) {
    e.preventDefault()
    // 发起ajax
    $.ajax({
      method: 'POST',
      url: '/my/article/addcates',
      // 快速获取表单数据
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('新增文章分类识别')
        }
        initArtCateList()
        layer.msg(res.message)
        // 根据索引，关闭弹出层
        layer.close(indexAdd)
      },
    })
  })

  // 动态模板需要事件委托事项事件绑定
  // 编辑事件显示对应事件处理
  let indexEdit = null
  $('tbody').on('click', '#btn-edit', function () {
    indexEdit = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '修改文章分类',
      content: $('#dialog-edit').html(),
    })

    // 获取自定义属性Id
    let id = $(this).attr('data-id')
    //  根据Id修改
    $.ajax({
      method: 'GET',
      url: '/my/article/cates/' + id,
      success: function (res) {
        form.val('form-edit', res.data)
      },
    })
  })

  // 通过事件委托，给编辑确定按钮绑定提交事件
  $('body').on('submit', '#form-edit', function (e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/article/updatecate',
      // 快速获取表单数据
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 200) {
          return layer.msg('修改分类信息失败')
        }
        layer.msg('修改分类信息成功')
        // 关闭弹出层
        layer.close(indexEdit)
        // 更新数据
        initArtCateList()
      },
    })
  })

  // 通过代理的形式为删除绑定删除事件
  $('tbody').on('click', '#btn-delete', function () {
    // 获取Id
    let id = $(this).attr('data-id')

    // 确认提示框
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
      // 发请求
      $.ajax({
        method: 'GET',
        url: '/my/article/deletecate/' + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg('删除文章分类失败')
          }
          layer.msg(res.message)
          // 关闭
          layer.close(index)
          initArtCateList()
        },
      })
    })
  })
})
