/**
 * Created by Feddiyao on 2017/2/17.
 */
$(document).ready(function () {
  var reportModal = new ReportModal();

  //多选框组件
  multiSelectRender($('.multiselect'));

  //fileInput
  $(".input-upload").fileinput({
    overwriteInitial: true,
    initialCaption: "请选择要上传的文件",
    showUpload: false
  });

  reportModal.datepickerRender($('.datepicker1'), $('#uploadReportForm'), 'reportIssuedDate');
  reportModal.datepickerRender($('.datepicker2'), $('#editUploadReportForm'), 'reportIssuedDate');
  reportModal.datepickerRender($('.datepicker3'), $('#editUploadGeneReportForm'), 'reportIssuedDate');
  reportModal.datepickerRender($('.datepicker4'), $('#uploadGeneReportForm'), 'reportIssuedDate')

  //上传基础病理报告前端验证
  reportModal.reportFormValidation('#uploadReportForm', 'createModal');

  // 编辑基础病理报告前端验
  reportModal.reportFormValidation('#editUploadReportForm', 'editModal');

  //分子病理上传报告前端验证
  reportModal.reportFormValidation('#uploadGeneReportForm', 'createModal');

  //分子病理编辑报告前端验证
  reportModal.reportFormValidation('#editUploadGeneReportForm', 'editModal');

  // 根据不同的附件类型显示相关字段
  $('#uploadModal').on('shown.bs.modal', function() {
    reportModal.fieldsChangeByAttachmentType();
  });

  //其他附件上传前端验证
  reportModal.attachmentFormValidation();

});

$('#uploadReportModal').on('hidden.bs.modal', function() {
  $('#uploadReportForm select[name="orgPathologyNos"]').val('');
  $('#uploadReportForm select[name="orgPathologyNos"]').multiselect("refresh");
  $('#uploadReportForm').formValidation('resetForm', true);
  $('#uploadReportForm .input-upload').fileinput('reset');
  $('#uploadReportForm #orgPathologyNos').val("");
  $('#uploadReportForm #consultationNo').val("");
  $('#uploadReportModal #dstHospitalId').val("");
});
$('#editUploadReportModal').on('hidden.bs.modal',function() {
  $('#editUploadReportForm select[name="orgPathologyNos"]').val('');
  $('#editUploadReportForm select[name="orgPathologyNos"]').multiselect("refresh");
  $('#editUploadReportForm').formValidation('resetForm',true);
  $('#editUploadReportModal .input-upload').fileinput('reset');
});
$('#uploadGeneReportModal').on('hidden.bs.modal', function() {
  $('#uploadGeneReportForm select[name="orgPathologyNos"]').val('');
  $('#uploadGeneReportForm select[name="orgPathologyNos"]').multiselect("refresh");
  $('#uploadGeneReportForm').formValidation('resetForm', true);
  $('#uploadGeneReportModal .input-upload').fileinput('reset');
});
$('#editUploadGeneReportModal').on('hidden.bs.modal', function() {
  $('#editUploadGeneReportForm select[name="orgPathologyNos"]').val('');
  $('#editUploadGeneReportForm select[name="orgPathologyNos"]').multiselect("refresh");
  $('#editUploadGeneReportForm').formValidation('resetForm', true);
  $('#editUploadGeneReportModal .input-upload').fileinput('reset');
});

//Modal显示消失的时候重置验证表单
$('#uploadModal').on('hidden.bs.modal', function() {
  $('#uploadForm').formValidation('resetForm', true);
  $('#uploadForm select[name="orgPathologyNos"]').val('');
  $('#uploadForm select[name="orgPathologyNos"]').multiselect("refresh");
  $('#orgReportFields').hide();
  $("#uploadModal .input-upload").fileinput('reset');
  $("#uploadModal #attachType").val("");
});

var ReportModal = new Function();

//报告Modal的前端验证
ReportModal.prototype.reportFormValidation = function(form, modalType) {
  //上传基础病理报告前端验证
  $(form).formValidation({
    framework:'bootstrap',
    excluded:':disabled',
    locale:'zh_CN',
    fields:{
      orgPathologyNos: {
        validators: {
          notEmpty: {}
        }
      },
      dstHospitalId: {
        validators: {
          notEmpty: {}
        }
      },
      consultationNo: {
        validators: {
          notEmpty: {}
        }
      },
      files: {
        validators: {
          notEmpty: {}
        }
      },
      reportIssuedDate: {
        validators: {
          notEmpty: {}
        }
      }
    }
  }).on('success.form.fv',function(e){
    if (modalType === 'createModal') {
      var options={
        dataType: 'json',
        success: function (data) {
          if (data.code == '200') {
            layer.msg("添加成功！");
            delayDetailReload(activeTabUrl("reportTab"));
          } else {
            layer.msg(data.message);
          }
        }
      };
      $(form).ajaxForm(options);
    } else {
      // Prevent form submission
      e.preventDefault();
      ajaxFileForm(this, activeTabUrl("reportTab"));
    }
  });
  if (modalType === 'createModal') {
    $(form).data('formValidation').enableFieldValidators('files', true);
  } else {
    $(form).data('formValidation').enableFieldValidators('files', false);
  }
};

//modal框日期选择器验证
ReportModal.prototype.datepickerRender = function ($element, $form, revalidateField) {
  $element.datepicker({
    format: 'yyyy-mm-dd',
    language: 'zh-CN',
    autoclose: true,
    todayHighlight: true
  }).on('changeDate', function (e) {
    $form.formValidation('revalidateField', revalidateField);
  });

}

//附件的modal框字段变化
ReportModal.prototype.fieldsChangeByAttachmentType = function() {
  $('#attachType').change(function() {
    $('#orgReportFields').hide();
    if ($(this).val() === 'ORG_REPORT') {
      $('#orgReportFields').show();
    }
  });
};

//附件上传的前端验证
ReportModal.prototype.attachmentFormValidation = function() {
  $('#uploadForm').formValidation({
    framework:'bootstrap',
    excluded:':disabled',
    locale:'zh_CN',
    fields: {
      type: {
        validators: {
          notEmpty: {}
        }
      },
      orgPathologyNos: {
        validators: {
          callback: {
            message: '不得为空',
            callback: function () {
              var type = $('#uploadForm').find('[name="type"]').val();
              var orgPathology = $('#uploadForm').find('[name="orgPathologyNos"]').val();
              if (type != "ORG_REPORT"){
                return true;
              } else if (orgPathology != null && orgPathology != ''){
                return true;
              } else {
                return false;
              }
            }
          }
        }
      },
      files: {
        validators: {
          notEmpty: {}
        }
      }
    }
  }).on('success.form.fv',function(e){
    var options={
      dataType: 'json',
      success: function (data) {
        if (data.code == '200') {
          layer.msg("添加成功！");
          delayDetailReload(activeTabUrl("attachmentTab"));
        } else {
          layer.msg(data.message);
        }
      }
    };
    $('#uploadForm').ajaxForm(options);
  })
};
