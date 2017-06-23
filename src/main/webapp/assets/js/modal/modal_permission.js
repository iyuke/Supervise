/**
 * Created by Feddiyao on 2017/2/21.
 */
$(document).ready(function () {
  var permissionModal = new PermissionModal();
  permissionModal.formValidation($('#createForm'));
  permissionModal.formValidation($('#editForm'));

  $('.allOption').click(function () {
    var id = this.parentNode.parentNode.parentNode.getAttribute("id");
    var checkStatus = this.checked;
    var elements = $("div#" + id + " .resourceIdList");
    permissionModal.setChecked(elements, checkStatus);
  });

  $(".resourceIdList").click(function () {
    var id = this.parentNode.parentNode.parentNode.parentNode.getAttribute("id");
    var elements = $("div#" + id + " .resourceIdList");
    var allOption = $("div#" + id + " .allOption");
    permissionModal.setAllOption(elements, allOption[0], $(this).prop('checked'))
  });

  //重置验证表单
  $('#createModal').on('hidden.bs.modal', function () {
    $('#createForm').formValidation('resetForm', true);
  });
  $('#editModal').on('hidden.bs.modal', function () {
    $('#editForm').formValidation('resetForm', true);
  });
});

var PermissionModal = new Function();
PermissionModal.prototype.formValidation = function ($element) {
  $element.formValidation({
    framework: 'bootstrap',
    excluded: ':disabled',
    locale: 'zh_CN',
    fields: {
      name: {
        validators: {
          notEmpty: {}
        }
      },
      code: {
        validators: {
          notEmpty: {}
        }
      },
      permissionType: {
        validators: {
          notEmpty: {}
        }
      },
    }
  }).on('success.form.fv', function (e) {
    // 异步提交
    var options = {
      dataType: 'json',
      success: function (data) {
        if (data.code == '200') {
          location.reload();
        } else {
          layer.msg(data.message);
        }
      }
    };
    $element.ajaxForm(options);
  });
}

PermissionModal.prototype.setAllOption = function (elements, allOption, checkStatus) {
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

PermissionModal.prototype.setChecked = function (elements, status) {
  for (var i = 0; i < elements.length; i++) {
    elements[i].checked = status;
  }
};