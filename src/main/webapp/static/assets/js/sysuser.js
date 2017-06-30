/**
 * Created by Feddiyao on 2017/2/26.
 */
$(document).ready(function () {
  var sysuser = new SysUser()
  // 显示编辑 用户信息框，并填充 用户信息
  $('.userName').on("click",function(){
    var id = $(this).attr('id');
    sysuser.editModalShow(id)
  });

  $('.setViewOrg').on("click", function () {
    var id = $(this).attr('id');
    // sysuser.queryOrgModalShow(id);
    sysuser.editModalShow(id)
  });

  // 重置用户密码
  $('.resetPasswd').on("click", function () {
    var id = $(this).attr('id');
    sysuser.passwordReset(id)
  });

  //查找用户modal展示
  $('#sysUserSearchBtn').on('click', function () {
    $('#searchModal').modal('show');
  })

  //创建用户modal展示
  $('#sysUserCreateBtn').on('click', function () {
    $('#createModal').modal('show');
  })
});

var SysUser = new Function();

SysUser.prototype.editModalShow = function (id) {
  var that = this;
  var params = {
    uId: id
  }
  $.ajax({
    type: 'POST',
    url: ctxPath + 'be/user/detail',
    data: params,
    dataType: 'JSON',
    success: function (msg) {
      if (msg.error == null) {
        that._showEdit(msg);
      }
    }
  });
}

// 设置编辑 用户信息各字段的值
SysUser.prototype._showEdit = function (object) {
  $("#id_edit").val(object.id);
  $("#userName_edit").val(object.userName);
  $("#fullName_edit").val(object.fullName);
  $("#mobilePhone_edit").val(object.mobilePhone);
  $("#email_edit").val(object.email);
  $("#gender_edit").val(object.gender);
  $("#age_edit").val(object.age);
  $("#duty_edit").val(object.duty);
  $("#remark_edit").val(object.remark);
  $("#valid_edit").val(String(object.valid));

  $('#userRoleList_edit').multiselect('deselectAll', false);
  for (var i = 0; i < object.userRoleList.length; i++) {
    $('#userRoleList_edit').multiselect('select', object.userRoleList[i]);
  }

  var tabContent = $("#tabContentEdit input[type='radio']");
  for (var i = 0; i < tabContent.length; i++) {
    if (tabContent[i].getAttribute("value") == object.organizationId) {
      var tabId = tabContent[i].closest(".tab-pane").id;
      this._setTabActive($("#tabTitleEdit li"), $("#tabContentEdit div[name='tabId']"), tabId);
      tabContent[i].checked = true;
      //当前选中机构为科室时，展开科室列表
      $(tabContent[i]).closest('.sub-orgs').show();
      //当前选中机构为医院时，展开科室列表
      $(tabContent[i]).parent().parent().find('.sub-orgs').show();
    } else {
      tabContent[i].checked = false;
    }
  }
  $('#editModal').modal('show');
};

SysUser.prototype._setTabActive = function (tabTitles, tabContents, tabId) {
  for (var i = 0; i < tabTitles.length; i++) {
    if (tabContents[i].id == tabId) {
      tabTitles[i].setAttribute("class", "active");
      tabContents[i].setAttribute("class", "tab-pane active");
    } else {
      tabTitles[i].setAttribute("class", "");
      tabContents[i].setAttribute("class", "tab-pane");
    }
  }
}

SysUser.prototype.queryOrgModalShow = function (id) {
  $("#id_query").val(id);
  var that = this;
  var params = {
    id: id
  }
  $.ajax({
    type: 'POST',
    url: ctxPath + 'be/user/get-vieworg',
    data: params,
    dataType: 'JSON',
    success: function (msg) {
      if (msg.error == null) {
        that._showViewOrgModal(msg);
      }
    }
  });
  //提交queryOrgModal中的表单
  $("#set_vieworg").click(function() {
    var options = {
      dataType: 'json',
      success: function (data) {
        if (data.code == '200') {
          location.reload();
        }
      },
    };
    $('#setSysUserViewOrg').ajaxForm(options);
  });
  $('#queryOrgModal').modal('show')
};

SysUser.prototype._showViewOrgModal = function (data) {
  var checkboxesUnchecked = $("#tabContentQueryOrg input[type='checkbox']");
  var tabContent = $("#tabContentQueryOrg input[type='checkbox']");
  for (var i = 0; i < data.length; i++) {
    for (var j = 0; j < tabContent.length; j++) {
      if (tabContent[j].getAttribute("value") == data[i]) {
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
}

//根据已加载的可查询机构设置全选框是否为选中
SysUser.prototype._checkSelectAll = function () {
  var tab = $("#queryOrgModal div[name='tabId'] input");
  var allSelectOption = null;
  var isAllSelected = false;
  var pass = false;
  for (var i = 0; i < tab.length - 1; i++) {
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
      if (tab[i].getAttribute("class") == "q-orgHosp" && !tab[i].checked) {
        isAllSelected = false;
        pass = true;
      }
    }
  }
  //轮询结束后，给最后一个tab项的全选框设值
  allSelectOption.checked = isAllSelected;
};

SysUser.prototype.passwordReset = function (id) {
  var params = {
    userId: id
  }
  $.ajax({
    type: 'POST',
    url: ctxPath + 'be/user/reset-password',
    data: params,
    dataType: 'JSON',
    success: function (msg) {
      layer.msg("重置默认密码成功！");
    }
  });
}

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