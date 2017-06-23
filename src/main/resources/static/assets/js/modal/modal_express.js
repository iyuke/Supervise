/**
 * Created by Feddiyao on 2017/2/17.
 */
$(document).ready(function () {
  var expressModal = new ExpressModal();
  //Modal显示消失的时候重置验证表单
  $('#createExpressModal').on('hidden.bs.modal', function () {
    $('#createExpressForm').formValidation('resetForm', true);
    expressModal.cleanExpressCreateInfo();
  });

  //创建物流信息
  expressModal.expressFormValidation();

  //检查物理单号是否存在
  $('#expressNo').on('blur', function () {
    expressModal.checkExpressNoIfExist($(this).val())
  })
});

//物流管理
var ExpressModal = new Function();

//创建物流信息前端验证
ExpressModal.prototype.expressFormValidation = function() {
  $("#createExpressForm").formValidation({
    framework: 'bootstrap',
    excluded: ':disabled',
    locale: 'zh_CN',
    fields: {
      'description': {
        validators: {
          notEmpty: {}
        }
      },
      'expressNo':{
        validators:{
          notEmpty:{}
        }
      },
      'expressCompany':{
        validators: {
          notEmpty: {}
        }
      },
      expressStartPlace: {
        validators: {
          notEmpty: {}
        }
      },
      expressEndPlace: {
        validators: {
          notEmpty: {}
        }
      }
    }
  }).on('success.form.fv', function (e) {
    var options = {
      type:'post',
      dataType: 'json',
      url: ctxPath + 'be/express/create',
      success: function (data) {
        if (data.code == '200') {
          layer.msg("添加成功！");
          delayDetailReload(activeTabUrl("expressTab"));
        } else {
          layer.msg(data.message);
        }
      }
    };
    $('#createExpressForm').ajaxForm(options);
  });
};

//检查物流单号是否存在
ExpressModal.prototype.checkExpressNoIfExist = function (expressNo) {
  var that = this;
  if (expressNo.trim() == '') {
    return;
  }
  $.ajax({
    type: 'post',
    url: ctxPath + 'be/express/check-exist',
    data: {
      expressNo : expressNo
    },
    dataType: 'json',
    success: function(data) {
      if (JSON.stringify(data) != "{}") {
        layer.confirm("物流信息已存在，是否使用？", {
          btn:['确认', '取消'],
          closeBtn: 0
        }, function (index) {
          $("#expressCompany").val(data["expressCompany"]);
          $("#expressType").val(data["expressType"]);
          $("#expressStartPlace").val(data["expressStartPlace"]);
          $("#expressEndPlace").val(data["expressEndPlace"]);
          $("#expressDate").val(data["expressDate"]);
          $("#expressDesc").val(data["expressDesc"]);
          // that._setExpressDisabled(true);
          layer.close(index);
        }, function (index) {
          $("#expressNo").val("");
          return;
        })
      } else {
        if ($("#expressCompany").attr("readonly") == "readonly") {
          that._setExpressDisabled(false);
          that.cleanExpressCreateInfo();
        }
      }
    }
  })
};

//清空物流创建信息
ExpressModal.prototype.cleanExpressCreateInfo = function () {
  $("#expressType").val("");
  $("#expressNo").val("");
  $("#expressCompany").val("");
  $("#expressStartPlace").val("");
  $("#expressEndPlace").val("");
  $("#expressDate").datepicker('setDate','');
  $("#expressDesc").val("");
};

//设置物流信息编辑状态
ExpressModal.prototype._setExpressDisabled = function (status) {
  $("#expressCompany").attr("readonly", status);
  $("#expressCompany option:not(:selected)").prop("disabled", status);
  $("#expressType").attr("readonly", status);
  $("#expressType option:not(:selected)").prop("disabled", status);
  $("#expressStartPlace").prop("disabled", status);
  $("#expressEndPlace").prop("disabled", status);
  $("#expressDate").prop("disabled", status);
};