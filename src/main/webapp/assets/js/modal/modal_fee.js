/**
 * Created by Feddiyao on 2017/2/17.
 */
$(document).ready(function () {
  var feeModal = new FeeModal(orderNo);

  //上传退款金额
  feeModal.arrearsAndRefundFormValidation('refund');

  //上传补款金额
  feeModal.arrearsAndRefundFormValidation('arrears');
});
//费用管理
var FeeModal = function (orderNo) {
  this.orderNo = orderNo;
};

//补退款信息的前端验证
FeeModal.prototype.arrearsAndRefundFormValidation = function(operateType) {
  var that = this;
  $("#" + operateType + "Form").formValidation({
    framework: 'bootstrap',
    excluded: ':disabled',
    locale: 'zh_CN',
    fields: {
      'refund': {
        validators: {
          notEmpty: {},
          numeric: {
            message: '请输入有效的数字'
          }
        }
      },
      'arrears': {
        validators: {
          notEmpty: {},
          numeric: {
            message: '请输入有效的数字'
          }
        }
      }
    }
  }).on('success.form.fv', function (e) {
    var message;
    if (operateType == 'refund') {
      message = '确认提交退款信息？';
    } else {
      message = '确认提交补款信息？'
    }
    layer.confirm(message, {
      btn: ['是', '否'],
      closeBtn: 0
    }, function (index, layero) {
      e.preventDefault();
      if (operateType == 'refund') {
        that._commitRefund($("#refundForm input[name='refund']").val());
      } else {
        that._commitArrears($("#arrearsForm input[name='arrears']").val());
      }
      layer.close(index);
    }, function (index) {
      layer.close(index);
      return false;
    });
    return false;
  })
};

//提交补款信息
FeeModal.prototype._commitArrears = function(arrears) {
  var that = this;
  $.ajax({
    type: 'post',
    data: {
      orderNo: that.orderNo,
      arrears: arrears
    },
    url: ctxPath + 'be/order/fee/arrears',
    success: function(data) {
      if (data.code == '200') {
        layer.msg("操作成功！");
        delayDetailReload(activeTabUrl("feeTab"));
      } else {
        layer.msg(data.message);
      }
    }
  });
};

//提交退款信息
FeeModal.prototype._commitRefund = function(refund) {
  $.ajax({
    type: 'post',
    data: {
      orderNo: this.orderNo,
      refund: refund
    },
    url: ctxPath + 'be/order/fee/refund',
    success: function(data) {
      if (data.code == '200') {
        layer.msg("操作成功！");
        delayDetailReload(activeTabUrl("feeTab"))
      } else {
        layer.msg(data.message);
      }
    }
  });
};