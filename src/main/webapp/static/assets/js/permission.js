/**
 * Created by Feddiyao on 2017/2/21.
 */
$(document).ready(function () {
  var permission = new Permission();
  var status = $('#page-status').attr('class')

  $('.permissionName').on('click', function () {
    if (status === 'dynamic') {
      var permissionId = $(this).attr('value');
      permission.permissionDetailShow(permissionId);
    }  else {
      $('#editModal').modal('show');
    }
  });

  $('#permissionCreate').on('click', function () {
    $('#createModal').modal('show');
  });

  $('#permissionSearch').on('click', function () {
    $('#searchModal').modal('show')
  });
  
  //删除权限操作
  $('.deleteBtn').on("click", function () {
    var id = $(this).attr("id");
    var permissionName = $(this).attr("permissionName");
    permission.deletePermission(id, permissionName)
  });
});

var Permission = new Function();
Permission.prototype.permissionDetailShow = function(permissionId) {
  var params = {
    pId: permissionId
  };
  var that = this;
  $.ajax({
    type: 'post',
    url: ctxPath + 'be/permission/detail',
    data: params,
    dataType: 'json',
    success: function (msg) {
      if (msg.error == null) {
        that._showEdit(msg);
      }
    },
    error: function (msg) {
      alert("error");
    }
  });
};

Permission.prototype._showEdit = function (permission) {
  $("#id_edit").val(permission.id);
  $("#name_edit").val(permission.name);
  $("#permissionType_edit").val(permission.permissionType);
  $("#code_edit").val(permission.code);
  $("#permissionDescription_edit").val(permission.permissionDescription);

  var tabContent = $("#tabContentEdit input[type='checkbox']");
  var checkboxesUnchecked = $("#tabContentEdit input[type='checkbox']");
  for (var i = 0; i < permission.resourceIdList.length; i++) {
    for (var j = 0; j < tabContent.length; j++) {
      if (tabContent[j].getAttribute("value") == permission.resourceIdList[i]) {
        tabContent[j].checked = true;
        tabContent.splice(j, 1);
        checkboxesUnchecked.splice(j, 1);
        break;
      }
    }
  }
  for (var j = 0; j < tabContent.length; j++) {
    tabContent[j].checked = false;
  }
  this._checkSelectAll();
  $("#editModal").modal('show');
};

//根据已加载的source设置全选框是否为选中
Permission.prototype._checkSelectAll = function () {
  var tab = $("#editModal div[name='tabId'] input");
  var allSelectOption = null;
  var isAllSelected = false;
  var pass = false;
  for (var i = 0; i < tab.length; i++) {
    //首先找到当前需要处理的全选框
    if (tab[i].getAttribute("type") != "checkbox") {
      continue;
    }
    if (tab[i].getAttribute("name") == "allOption") {
      if (allSelectOption != null) {
        allSelectOption.checked = isAllSelected;
      }
      allSelectOption = tab[i];
      isAllSelected = false;
      pass = false;
      continue;
    }
    //如果当前tabContent中已经存在未选中的项，则后续项无需再检查
    if (!pass) {
      isAllSelected = true;
      if (!tab[i].checked) {
        isAllSelected = false;
        pass = true;
      }
    }
  }
  //轮询结束后，给最后一个tab项的全选框设值
  allSelectOption.checked = isAllSelected;
};

Permission.prototype.deletePermission = function (id, permissionName) {
  layer.confirm("您即将删除权限'" + permissionName + "'，请确认！", {
    btn:['确认', '取消'],
    closeBtn: 0
  }, function (index) {
    var params = {
      id: id
    };
    $.ajax({
      type: 'POST',
      url: ctxPath + 'be/permission/delete',
      data: params,
      dataType: 'JSON',
      success: function (msg) {
        if (msg.code == 200) {
          location.reload();
        }else{
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

};
$("#PaginatorUl").bootstrapPaginator(options);

function search(currentPage) {
  $("#search_form input[name='currentPage']").val(currentPage);
  $("#search_form")[0].submit();
}
