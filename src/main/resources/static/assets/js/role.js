/**
 * Created by Feddiyao on 2017/2/20.
 */
$(document).ready(function () {
  var role = new Role();
  var status = $('#page-status').attr('class')

  $('.roleId').on('click', function () {
    if (status === 'dynamic') {
      role.getRoleDetail($(this).attr("value"))
    } else {
      $("#editModal").modal('show');
    }
  });

  $('.roleCreateBtn').on('click', function () {
    role.getRoleCreate();
  })

});

var Role = new Function();

Role.prototype.getRoleDetail = function (roleId) {
  var params = {
    roleId: roleId
  };
  var that = this;
  $.ajax({
    type: 'post',
    url: ctxPath + 'be/role/detail',
    data: params,
    dataType: 'json',
    beforeSend: that._cleanRoleEdit(),
    success: function (msg) {
      if (msg.error == null) {
        that._showRoleEdit(msg);
      }
    }
  });
};

Role.prototype._cleanRoleEdit = function () {
  $("#id_edit").val("");
  $("#roleName_edit").val("");
  $("#roleCode_edit").val("");
  $("#valid_edit").val("");
  var tabTitle = $("#tabTitleEdit li");
  for (var i = 0; i < tabTitle.length; i++) {
    if (i == 0) {
      tabTitle[i].setAttribute("class", "active");
    } else {
      tabTitle[i].removeAttribute("class");
    }
  }
  var tabContentId = $('#editModal div[name="tabId"]');
  for (var i = 0; i < tabContentId.length; i++) {
    if (i == 0) {
      tabContentId[i].setAttribute("class", "tab-pane active");
    } else {
      tabContentId[i].setAttribute("class", "tab-pane");
    }
  }
  var tabContent = $('#tabContentEdit input[type="checkbox"]');
  for (var i = 0; i < tabContent.length; i++) {
    tabContent[i].checked = false;
  }
}

Role.prototype._showRoleEdit = function (role) {
  $("#id_edit").val(role.id);
  $("#roleName_edit").val(role.roleName);
  $("#roleCode_edit").val(role.roleCode);
  $("#valid_edit").val(role.valid);
  var tabContent = $('#tabContentEdit input[type="checkbox"]');
  for (var i = 0; i < role.permissionIdList.length; i++) {
    for (var j = 0; j < tabContent.length; j++) {
      if (tabContent[j].getAttribute("value") == role.permissionIdList[i]) {
        tabContent[j].checked = true;
        tabContent.splice(j, 1);
        break;
      }
    }
  }
  if (role.roleCode != 'DEVELOPER') {
    $('#tabTitleEdit').find('li[name="developer"]').hide();
  } else {
    $('#tabTitleEdit').find('li[name="developer"]').show();
  }
  this._checkSelectAll();
  $("#editModal").modal('show');
};

//根据已加载的permission设置全选框是否为选中
Role.prototype._checkSelectAll = function checkSelectAll() {
  var tab = $('#editModal div[name="tabId"] input');
  var allSelectOption = null;
  var isAllSelected = false;
  var pass = false;
  for (var i = 0; i < tab.length; i++) {
    //首先找到当前需要处理的全选框
    if (tab[i].getAttribute('type') != 'checkbox') {
      continue;
    }
    if (tab[i].getAttribute('name') == 'allOption') {
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

Role.prototype.getRoleCreate = function () {
  this._cleanRoleCreate();
  $('#createModal').modal();
};

Role.prototype._cleanRoleCreate = function() {
  $("#roleName_create").val("");
  $("#roleCode_create").val("");
  $("#valid_create").children()[0].selected = true;
  var tabTitle = $("#tabTitleCreate li");
  for (var i = 0; i < tabTitle.length; i++) {
    if (i == 0) {
      tabTitle[i].setAttribute('class', 'active');
    } else {
      tabTitle[i].removeAttribute('class');
    }
  }
  var tabContentId = $('#createModal div[name="tabId"]');
  for (var i = 0; i < tabContentId.length; i++) {
    if (i == 0) {
      tabContentId[i].setAttribute('class', 'tab-pane active');
    } else {
      tabContentId[i].setAttribute('class', 'tab-pane');
    }
  }
  var tabContent = $('#tabContentCreate input[type="checkbox"]');
  for (var i = 0; i < tabContent.length; i++) {
    tabContent[i].checked = false;
  }
};