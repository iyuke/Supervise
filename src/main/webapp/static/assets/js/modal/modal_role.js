/**
 * Created by Feddiyao on 2017/2/20.
 */
$(document).ready(function () {
  var roleModal = new RoleModal();
  roleModal.formValidation($('#createForm'));
  roleModal.formValidation($('#editForm'));

  $("input[name='permissionIdList']").click(function () {
    var id = this.parentNode.parentNode.parentNode.parentNode.getAttribute("id");
    var checkStatus = this.checked;
    var elements = $("div#" + id + " input[name='permissionIdList']");
    var allOption = $("div#" + id + " input[name='allOption']");
    roleModal.setAllOption(elements, allOption[0], checkStatus);
  });

  $("input[name='allOption']").click(function () {
    var id = this.parentNode.parentNode.parentNode.getAttribute("id");
    var checkStatus = this.checked;
    var elements = $("div#" + id + " input[name='permissionIdList']");
    roleModal.setChecked(elements, checkStatus);
  });

  //重置验证表单
  $('#createModal').on('hidden.bs.modal', function () {
    $('#createForm').formValidation('resetForm', true);
  });
  $('#editModal').on('hidden.bs.modal', function () {
    $('#editForm').formValidation('resetForm', true);
  });
});

var RoleModal = new Function();
RoleModal.prototype.formValidation = function ($element) {
  $element.formValidation({
    framework: 'bootstrap',
    excluded: ':disabled',
    locale: 'zh_CN',
    fields: {
      'roleName': {
        validators: {
          notEmpty: {},
        },
      },
      'roleCode': {
        validators: {
          callback: {
            message: '角色代码由英文字母和下划线组成',
            callback: function () {
              var roleCode = $element.find('[name="roleCode"]').val();
              if (/(^[a-zA-Z_]{1,}$)/.test(roleCode)) {
                return true;
              } else {
                return false;
              }
            }
          }
        }
      },
      'permissionIdList': {
        validators: {
          notEmpty:{},
        }
      }
    }
  }).on('success.form.fv', function (e) {
    // 异步提交
    var options = {
      dataType: 'json',
      success: function (data) {
        if (data.code == '200') {
          location.reload();
        } else {
          layer.msg("添加失败,角色代码已存在");
          delayReload();
        }
      },
      error: function (data) {
        layer.msg(data.responseJSON.message)
      }
    };
    $element.ajaxForm(options);
  });
}

RoleModal.prototype.setAllOption = function (elements, allOption, checkStatus) {
  if (checkStatus) {
    var isAllSelected = true;
    for (var i = 0; i < elements.length; i++) {
      if (!elements[i].checked) {
        isAllSelected = false;
        break;
      }
    }
    allOption.checked = isAllSelected;
  } else {
    allOption.checked = false;
  }
};

RoleModal.prototype.setChecked = function (elements, status) {
  for (var i = 0; i < elements.length; i++) {
    elements[i].checked = status;
  }
};
