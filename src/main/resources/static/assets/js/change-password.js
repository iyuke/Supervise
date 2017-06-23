/**
 * Created by Feddiyao on 2017/2/28.
 */
$(document).ready(function() {
  $('#cancel').click(function() {
    window.location.href=ctxPath + "be/index";
  });
});

// 修改密码
var chgformOptions = {
  dataType:'json',
  beforeSubmit: function(arr, $form, options) {
    if(arr[0].value.trim() == "") {
      $("#chgform-error").text("请输入老密码");
      $("#chgform-error").show();
      return false;
    }
    if(arr[1].value.trim() == "") {
      $("#chgform-error").text("请输入新密码");
      $("#chgform-error").show();
      return false;
    }
    if(arr[2].value.trim() == "") {
      $("#chgform-error").text("请输入确认新密码");
      $("#chgform-error").show();
      return false;
    }
    if(arr[1].value.trim() != arr[2].value.trim()) {
      $("#chgform-error").text("新密码两次输入不一致");
      $("#chgform-error").show();
      return false;
    }
  },
  success: function(data) {
    $("#chgform-error").hide();
    layer.confirm(data.message, {
      btn:['确认'],
      closeBtn: 0
    }, function (index) {
      window.location.href = ctxPath + "be/logout";
    });
  },
  error : function(data){
    $("#chgform-error").text(data.responseJSON.message);
    $("#chgform-error").show();
  }
};
$('#chgform').ajaxForm(chgformOptions);