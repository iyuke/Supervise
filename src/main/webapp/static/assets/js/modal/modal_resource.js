/**
 * Created by Feddiyao on 2017/2/22.
 */
$(document).ready(function () {
  var resourceModal = new ResourceModal();
  resourceModal.formValidation($('#createForm'));
  resourceModal.formValidation($('#editForm'));

  //重置验证表单
  $('#createModal').on('hidden.bs.modal', function () {
    $('#createForm').formValidation('resetForm', true);
  });
  $('#editModal').on('hidden.bs.modal', function () {
    $('#editForm').formValidation('resetForm', true);
  });
});

var ResourceModal = new Function();
ResourceModal.prototype.formValidation = function ($form) {
  $form.formValidation({
    framework: 'bootstrap',
    excluded: ':disabled',
    locale: 'zh_CN',
    fields: {
      resourceName: {
        validators: {
          notEmpty: {}
        }
      },
      resourceType: {
        validators: {
          notEmpty: {}
        }
      },
      url: {
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
        }else{
          layer.msg(data.message);
        }
      }
    };
    $form.ajaxForm(options);
  });
}