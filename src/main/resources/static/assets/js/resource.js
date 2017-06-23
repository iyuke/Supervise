/**
 * Created by Feddiyao on 2017/2/22.
 */
$(document).ready(function () {
  var resource = new Resource();
  var status = $('#page-status').attr('class');
  //资源编辑框展示
  $('.resourceName').on('click', function () {
    if (status === 'dynamic') {
      var resourceId = $(this).attr('id');
      resource.resourceDetailShow(resourceId);
    }  else {
      $('#editModal').modal('show');
    }
  });

  $('#searchBtn').on('click',function () {
    $('#searchModal').modal('show');
  });

  $('#createBtn').on('click', function () {
    $('#createModal').modal('show');
  });

  //删除资源操作
  $('.deleteBtn').on('click', function () {
    var resourceId = $(this).attr("id");
    var resourceName = $(this).attr("resourceName");
    resource.deleteResource(resourceId, resourceName);
  });
});

var Resource = new Function();

Resource.prototype.resourceDetailShow = function (id) {
  var params = {
    id: id
  }
  $.ajax({
    type: 'post',
    url: ctxPath + 'be/resource/detail',
    data: params,
    dataType: 'json',
    success: function (resource) {
      if (resource.error == null) {
        $("#editModal #id_edit").val(resource.id);
        $("#editModal #resourceName_edit").val(resource.resourceName);
        $("#editModal #resourceType_edit").val(resource.resourceType);
        $("#editModal #resourceDescription_edit").val(resource.resourceDescription);
        $("#editModal #url_edit").val(resource.url);
        $("#editModal").modal('show');
      }
    }
  });
};

Resource.prototype.deleteResource = function (id, resourceName) {
  layer.confirm("您即将删除资源'" + resourceName + "'，请确认！", {
    btn: ['确认', '取消'],
    closeBtn: 0
  }, function (index) {
    var params = {
      id: id
    }
    $.ajax({
      type: 'POST',
      url: ctxPath + 'be/resource/delete',
      data: params,
      dataType: 'JSON',
      success: function (msg) {
        if (msg.code == 200) {
          location.reload();
        } else {
          layer.msg(msg.message);
        }
      }
    });
  }, function (index) {
    return;
  })
};

//分页
var options = {
  bootstrapMajorVersion: 3,
  alignment: "right",//居右显示
  currentPage: currentPage,//当前页面
  pageSize: pageSize,
  numberOfPages: 5,//一页显示几个按钮（在ul里面生成5个li）
  totalPages: totalPages, //总页数
  pageUrl: function (type, page, current) {
    if (page == current) {
      return "javascript:void(0)";
    } else {
      return 'javascript:search(' + page + ')';
    }
  }
}
$("#PaginatorUl").bootstrapPaginator(options);

function search(currentPage) {
  $("#search_form input[name='currentPage']").val(currentPage);
  $("#search_form")[0].submit();
}