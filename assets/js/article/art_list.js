$(function () {
  let layer = layui.layer
  let form = layui.form
  var laypage = layui.laypage

  // 定义美化时间的过滤器
  template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date)
    var y = dt.getFullYear()
    var m = padZero(dt.getMonth() + 1)
    var d = padZero(dt.getDate())

    var hh = padZero(dt.getHours())
    var mm = padZero(dt.getMinutes())
    var ss = padZero(dt.getSeconds())

    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
  }

  // 定义补零函数
  function padZero(n) {
    return n > 9 ? n : '0' + n
  }

  // 定义查询的参数对象
  let q = {
    pagenum: 1, // 页码值,默认请求第一页数据
    pagesize: 2, // 每页显示的条数
    cate_id: '', // 文章分类Id
    state: '', // 文章发布状态
  }

  // 获取文章列表数据
  initTable()
  // 获取文章分类列表
  initCate()

  // 获取文章列表数据方法
  function initTable() {
    $.ajax({
      method: 'GET',
      url: '/my/article/list',
      data: q,
      success: function (res) {
        // console.log(res.data)
        if (res.status !== 0) {
          return layer.msg('获取文章列表失败！')
        }
        // layer.msg('获取文章列表成功！')
        // 使用模板引擎渲染数据
        let htmlStr = template('tpl-table', res)
        $('tbody').html(htmlStr)

        // 渲染分页
        renderPage(res.total)
      },
    })
  }

  // 获取文章分类列表
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取文章分类失败!')
        }
        // 使用模板引擎渲染UI
        let htmlStr = template('tpl-cate', res)
        $('[name=cate_id]').html(htmlStr)
        // 通知 layui 重新渲染表单的数据结构
        form.render()
      },
    })
  }

  // 为筛选表单绑定事件
  $('#form-search').on('submit', function (e) {
    e.preventDefault()
    // 获取选择框的值
    let cate_id = $('[name=cate_id]').val()
    let state = $('[name=state]').val()
    // 更新q对象的值
    q.cate_id = cate_id
    q.state = state
    // 重新跟新文章列表数据
    initTable()
  })

  // // 筛选请求
  // function searchState(state) {
  //   $.ajax({
  //     method: 'GET',
  //     url: '/my/article/shaixuan',
  //     data: state,
  //     success: function (res) {
  //       console.log(res.data)
  //       if (res.status !== 0) {
  //         return layer.msg('筛选失败！')
  //       }
  //       // layer.msg('获取文章列表成功！')
  //       // 使用模板引擎渲染数据
  //       let htmlStr = template('tpl-table', res)
  //       $('tbody').html(htmlStr)
  //     },
  //   })
  // }

  // 渲染分页的方法
  function renderPage(total) {
    // 调用laypage.render()方法渲染分页的结构
    laypage.render({
      elem: 'pageBox', // 分页容器的id
      count: total, // 总数据条数
      limit: q.pagesize, // 每页显示几条数据
      curr: q.pagenum, // 设置默认被选中的分页
      layout: ['count', 'prev', 'limit', 'page', 'next', 'skip'],
      limits: [2, 3, 5, 10],
      // 分页发送切换时候，触发 jump 回调
      // 触发jump回调的方式有两种:
      // 1.点击页码的时候，会触发jump回调
      // 2.只有调用laypage.render()方法就会触发jump回调
      jump: function (obj, first) {
        // 可以通过first的值判断是那种方式触发的jump回调，true为第一种
        // console.log(first)
        // console.log(obj.curr)
        // 把最新的页码值赋值到 q 这个查询参数对象中
        q.pagenum = obj.curr
        // 把最新的条目数赋值给q对象上
        q.pagesize = obj.limit
        // 更具最新的q获取最新的渲染数据
        // initTable() // 之间调会发生死循环，触发第二种jump回调
        if (!first) {
          // 按第一种方式触发jump回调
          initTable()
        }
      },
    })
  }

  // 通过事件委托绑定删除按钮
  $('tbody').on('click', '.btn-delete', function () {
    // 获取id
    let id = $(this).attr('data-id')
    // 删除按钮个数
    let btnNum = $('.btn-delete').length

    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
      //do something
      // 发起ajax请求
      $.ajax({
        method: 'GET',
        url: '/my/article/delete/' + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg('删除文章失败1')
          }
          layer.msg('删除文章成功！')
          // 当数据删除完成后，需要判断当前这一页是否还有数据，如果没有数据了则页码值-1之后再重新调用     initTable()

          if (btnNum === 1) {
            // 如果删除按钮数为1，证明删除完毕后页码上就没有数据了
            // 页码最新必须为1
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
          }
          initTable()
        },
      })
      layer.close(index)
    })
  })
})
