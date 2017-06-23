/**
 * Created by Alex on 2017/2/24.
 */
$(document).ready(function() {
  initFormValidation();
});

var initFormValidation = function() {
  $('#createSampleInform').formValidation({
    framework:'bootstrap',
    excluded:':disabled',
    locale:'zh_CN',
    fields: {
      orgHospitalId: {
        validators: {
          notEmpty: {}
        }
      },
      'sampleInform.smallSampleNum': {
        validators: {
          notEmpty: {}
        }
      },
      'sampleInform.bigSampleNum': {
        validators: {
          notEmpty: {}
        }
      },
      'sampleInform.sampleReceiveDate': {
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
          delayReload();
        }
      }
    };
    $('#createSampleInform').ajaxForm(options);
  })

};
