/**
 * Created by Alex on 2017/2/22.
 */
$(document).ready(function() {
  initFormValidation();

  $('#export').on('click', exportTemplate);
});

var exportTemplate = function() {
  var orgHospitalId = $('#excelTemplateDownloadForm').find("[name='orgHospitalId']").val()
  var applicationDateRange = $('#excelTemplateDownloadForm').find("[name='applicationDateRange']").val()
  $.ajax({
    type: 'POST',
    url: ctxPath + 'be/sample/return/export-template/check',
    data: {
      orgHospitalId: orgHospitalId,
      applicationDateRange: applicationDateRange
    },
    dataType: 'JSON',
    success: function (msg) {
      if (msg.code == 200) {
        $('#excelTemplateDownloadForm').submit();
      }else{
        layer.msg(msg.message);
      }
    }
  });
  $('#excelTemplateDownloadModal').modal("hide")
};

var initFormValidation = function() {
  $('#uploadForm').formValidation({
    framework:'bootstrap',
    excluded:':disabled',
    locale:'zh_CN',
    fields:{
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
          layer.msg(data.message)
          delayReload();
        } else {
          layer.confirm(data.message, {
            btn:['确认'],
            closeBtn: 0
          }, function (index) {
            layer.close(index);
          });
        }
      }
    };
    $('#uploadForm').ajaxForm(options);
  });
};
