/**
 * Created by Feddiyao on 2017/2/15.
 */
$(document).ready(function () {
  $("#search_form").formValidation({
    framework: 'bootstrap',
    excluded: ':disabled',
    locale: 'zh_CN',
    fields: {
      'orgPathologyNo': {
        validators: {
          callback: {
            message: '各病理编号需要以;（半角）作为结束',
            callback: function () {
              var pathologyNos = $("#search_form").find('[name="orgPathologyNo"]').val();
              if (pathologyNos == "") {
                return true
              } else if (/^[a-zA-Z0-9;]+$/.test(pathologyNos)) {
                return true;
              } else {
                return false;
              }
            }
          }
        }
      },
    }
  })
})