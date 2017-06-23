/**
 * Created by Feddiyao on 2017/2/28.
 */
$(document).ready(function () {
  var menuModal = new MenuModal;
  menuModal.formValidation($('#createForm'));
  menuModal.formValidation($('#editForm'));

  var $createIsLink = $("#createModal input[name='isLink']");
  var $editIsLink = $("#editModal input[name='isLink']");

  $("#createModal .panel-default").hide();

  $createIsLink.change(function () {
    var isLink = $("#createModal input[name='isLink'][value='true']").prop("checked");
    if (!isLink) {
      $("#createModal .panel-default").hide();
    } else {
      $("#createModal .panel-default").show();
    }
  })

  $editIsLink.change(function () {
    var isLink = $("#editModal input[name='isLink'][value='true']").prop("checked");
    if (!isLink) {
      $("#editModal .panel-default").hide();
    } else {
      $("#editModal .panel-default").show();
    }
  })

  var $level = $('#level_create');
  var $parents = $('#parents_create');
  var $editLevel = $('#level_edit');
  var $editParents = $('#editParents');

  $level.change(function () {
    menuModal.changeParentMenu($level, $parents);
  });

  $editLevel.change(function () {
    menuModal.changeParentMenu($editLevel, $editParents);
  })

  //重置验证表单
  $('#createModal').on('hidden.bs.modal', function() {
    $('#createForm').formValidation('resetForm', true);
  });
  $('#editModal').on('hidden.bs.modal', function() {
    $('#editForm').formValidation('resetForm', true);
  });
});

var MenuModal = new Function();

MenuModal.prototype.formValidation = function ($form) {
  $form.formValidation({
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
      age: {
        validators: {
          notEmpty: {}
        }
      },
      priority: {
        validators: {
          notEmpty: {}
        }
      },
      parentId: {
        validators: {
          callback: {
            message:' ',
            callback:function(){
              var levelValue = $form.find('[name="level"]').val();
              var parent = $form.find('[name="parentId"]').val();
              if (levelValue == "" || levelValue == "1"){
                return true;
              } else if (parent !="") {
                return true;
              } else {
                return false;
              }
            }
          }
        }
      },
      level: {
        validators: {
          notEmpty:{}
        }
      },
      description: {
        validators: {
          stringLength: {
            max: 500,
            min: 1,
            message: '菜单描述不得超过500字'
          }
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
        }
      }
    };
    $form.ajaxForm(options);
  });
}

MenuModal.prototype.changeParentMenu = function ($level, $parents) {
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