/**
 * Created by Feddiyao on 2017/2/28.
 */
$(document).ready(function () {
  var menu = new Menu();
  $('.level2').on('hide.bs.collapse', function () {
    $('.level3.in').collapse('hide')
  });

  $('.editBtn').on("click", function () {
    var menuId = $(this).attr("id");
    menu.editModalShow(menuId);
  });

  $('.deleteBtn').on("click", function () {
    var menuId = $(this).attr("id");
    var menuName = $(this).attr("menuName");
    menu.menuDelete(menuId, menuName);
  });

  $('#menuCreateBtn').on('click', function () {
    menu.createModalShow();
  });
});

var Menu = new Function();
Menu.prototype.editModalShow = function (menuId) {
  var that = this;
  var params = {
    menuId: menuId
  };
  $.ajax({
    type: 'post',
    url: ctxPath + 'be/menu/detail',
    data: params,
    dataType: 'json',
    beforeSend: that._cleanMenuEdit(),
    success: function (msg) {
      if (msg.error == null) {
        that._showMenuEdit(msg);
      }
    }
  });
};

Menu.prototype._cleanMenuEdit = function () {
  $("#id_edit").val("");
  $("#name_edit").val("");
  $("#code_edit").val("");
  $("#level_edit").val("");
  this._setParentMenu("", $("#editParents"), "");
  $("#priority_edit").val("");
  $("#description_edit").val("");
  var tabTitle = $("#tabTitleEdit li");
  for (var i = 0; i < tabTitle.length; i++) {
    if (i == 0) {
      tabTitle[i].setAttribute("class", "active");
    } else {
      tabTitle[i].removeAttribute("class");
    }
  }
  var tabContentId = $("#editModal div[name='tabId']");
  for (var i = 0; i < tabContentId.length; i++) {
    if (i == 0) {
      tabContentId[i].setAttribute("class", "tab-pane active");
    } else {
      tabContentId[i].setAttribute("class", "tab-pane");
    }
  }
  var tabContent = $("#tabContentEdit input[type='radio']");
  for (var i = 0; i < tabContent.length; i++) {
    tabContent[i].checked = false;
  }
  $("#href0_edit")[0].checked = false;
  $("#href_edit").val("");
};

Menu.prototype._showMenuEdit = function (menu) {
  $("#id_edit").val(menu.id);
  $("#name_edit").val(menu.name);
  $("#code_edit").val(menu.code);
  $("#level_edit").val(menu.level);
  this._setParentMenu(menu.level, $("#editParents"), menu.parentId);
  $("#priority_edit").val(menu.priority);
  $("#description_edit").val(menu.description);
  var $isLink = $("#editModal input[name='isLink']");
  var linkValue;
  if (menu.isLink) {
    linkValue = "true";
    $("#editModal .panel-default").show();
  } else {
    linkValue = "false";
    $("#editModal .panel-default").hide();
  }
  for (var i = 0; i < $isLink.length; i++) {
    if ($isLink[i].value.trim() == linkValue) {
      $isLink[i].checked = true;
    } else {
      $isLink[i].checked = false;
    }
  }
  var tabIds = $("#tabContentEdit div[name='tabId']");
  var tabTitles = $("#tabTitleEdit a");
  var found = false;
  var tabId;
  for (var i = 0; i < tabIds.length; i++) {
    tabId = tabIds[i].id;
    var radios = $("#" + tabId + " input[type='radio']");
    for (var j = 0; j < radios.length; j++) {
      if (radios[j].value == menu.href) {
        radios[j].checked = true;
        found = true;
        break;
      }
    }
    if (found == true) {
      break;
    }
  }
  if (found) {
    for (var i = 0; i < tabTitles.length; i++) {
      if (tabTitles[i].href.endWith(tabId)) {
        tabTitles[i].parentNode.setAttribute("class", "active");
        $("#" + tabIds[i].id)[0].setAttribute("class", "tab-pane active");
      } else {
        tabTitles[i].parentNode.removeAttribute("class");
        $("#" + tabIds[i].id)[0].setAttribute("class", "tab-pane");
      }
    }
  } else {
    $("#href0_edit")[0].checked = true;
    $("#href_edit").val(menu.href);
  }

  $("#editModal").modal('show');
};

Menu.prototype._setParentMenu = function(level, $parents, parentId) {
  if (level != "" && level != "1") {
    $.ajax({
      type: 'post',
      dataType: 'json',
      data: {'level': level - 1},
      url: ctxPath + 'be/menu/level',
      success: function (result) {
        resetOptions($parents);
        $.each(result, function (i, e) {
          if (e.id == parentId) {
            $parents.append('<option value="' + e.id + '" selected="true">' + e.name + '</option>');
          } else {
            $parents.append('<option value="' + e.id + '">' + e.name + '</option>');
          }
        })
      }
    })
  } else {
    resetOptions($parents);
    $parents[0].style.display = "none";
  }
};

Menu.prototype.menuDelete = function (menuId, menuName) {
  layer.confirm("您即将删除菜单'" + menuName + "'及其所有子菜单，请确认！", {
    btn: ['确认', '取消'],
    closeBtn: 0
  }, function (index) {
    $.ajax({
      type: 'post',
      url: ctxPath + 'be/menu/delete',
      data: {menuId: menuId},
      dataType: 'json',
      success: function (data) {
        if (data.code == '200') {
          location.reload();
        }
      }
    });
    layer.close(index)
  }, function (index) {
    return;
  })
};

Menu.prototype.changeParentMenu = function ($level, $parents) {
  var level = $level.val();
  if (level != "" && level != "1") {
    $.ajax({
      type: 'post',
      dataType: 'json',
      data: {'level': level - 1},
      url: ctxPath + 'be/menu/level',
      success: function (result) {
        resetOptions($parents);
        $.each(result, function (i, e) {
          $parents.append('<option value="' + e.id + '">' + e.name + '</option>');
        })
      }
    });
  } else {
    resetOptions($parents);
    $parents[0].style.display = "none";
  }
  $('#editForm').formValidation('revalidateField', 'parentId');
  $('#createForm').formValidation('revalidateField', 'parentId');
};

Menu.prototype.createModalShow = function () {
  $("#name_create").val("");
  $("#code_create").val("");
  $("#level_create").val("");
  this.changeParentMenu($("#level_create"), $("#parents_create"));
  $("#priority_create").val("");
  $("#description_create").val("");
  var tabTitle = $("#tabTitleCreate li");
  for (var i = 0; i < tabTitle.length; i++) {
    if (i == 0) {
      tabTitle[i].setAttribute("class", "active");
    } else {
      tabTitle[i].removeAttribute("class");
    }
  }
  var tabContentId = $("#createModal div[name='tabId']");
  for (var i = 0; i < tabContentId.length; i++) {
    if (i == 0) {
      tabContentId[i].setAttribute("class", "tab-pane active");
    } else {
      tabContentId[i].setAttribute("class", "tab-pane");
    }
  }
  var tabContent = $("#tabContentCreate input[type='radio']");
  for (var i = 0; i < tabContent.length; i++) {
    tabContent[i].checked = false;
  }
  $("#href0_create")[0].checked = false;
  $("#href_create").val("");
  $('#createModal').modal('show');
};

// 清空选项
function resetOptions($e) {
  $e.empty();
  $e[0].style.display = "inline";
  $e.append('<option value="">请选择父菜单</option>');
}

String.prototype.endWith = function (str) {
  if (str == null || str == "" || this.length == 0 || this.length < str.length) {
    return false;
  }
  if (this.substring(this.length - str.length) == str) {
    return true;
  } else {
    return false;
  }
}