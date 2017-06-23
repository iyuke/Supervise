/**
 * Created by Feddiyao on 2017/2/17.
 */
$(document).ready(function () {
  $('#modifyStatus').on('hidden.bs.modal', function() {
    $('#orderStatusForm').formValidation('resetForm', true);
  });

  //订单状态修改前端验证
  statusFormValidation();

});

//订单状态前端验证
var statusFormValidation = function() {
  $('#orderStatusForm').formValidation({
    framework:'bootstrap',
    excluded:'disabled',
    locale:'zh_CN',
    fields:{
      orderState: {
        validators: {
          notEmpty: {}
        }
      }
    }
  }).on('success.form.fv',function(){
    var orderId = $("#orderId").val();
    var orderStatus = $("#orderState").val();
    var options = {
      type: 'post',
      data: {
        orderId: orderId,
        statusCode: orderStatus
      },
      dataType: 'json',
      url: ctxPath + 'be/order/update-status',
      success: function (data) {
        if (data.code == '200') {
          layer.msg("订单状态已变更！");
          //订单状态修改成功
          delayReload();
        } else {
          layer.msg(data.message);
        }
      }
    };
    $('#orderStatusForm').ajaxForm(options);
  });
};