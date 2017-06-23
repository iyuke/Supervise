/**
 * Created by Feddiyao on 2017/5/13.
 */
var $form = $("#editBasicForm")
$(document).ready(function () {
  var salesmanDetail = new SalesmanDetail();

  //基础信息编辑动态效果

  $('#editBasicInfoBtn').on('click', function () {
    $('#editBasicInfo').show();
    $('#viewBasicInfo').hide();
  });

  //取消基础信息动态编辑
  $('#resetBasicInfoEditBtn').on('click', function () {
    $('#editBasicInfo').hide();
    $('#viewBasicInfo').show();
  });

  //销售指标详情加载更多指标信息

  $('#moreInfoBtn').on('click', function () {
    $('.moreInfo').show();
    $(this).parent().parent().hide();
  });

  //销售指标编辑动态效果

  $('#editSalesInfoBtn').on('click', function () {
    $('#salesIndex_edit').show();
    $('#salesIndex_view').hide();
    $(this).hide();
    $('#confirmSalesInfoEditBtn').show();
    $('#resetSalesInfoEditBtn').show();
  });

  //取消销售指标动态编辑
  $('#resetSalesInfoEditBtn').on('click', function () {
    $('#salesIndex_edit').hide();
    $('#salesIndex_view').show();
    $(this).hide();
    $('#confirmSalesInfoEditBtn').hide();
    $('#editSalesInfoBtn').show();
  });

  //编辑销售基本信息前端验证
  salesmanDetail.basicInfoFormValidation($form);
});

var SalesmanDetail = new Function();
SalesmanDetail.prototype.basicInfoFormValidation = function ($form) {
  $form.formValidation({
    framework: 'bootstrap',
    excluded: ':disabled',
    locale: 'zh_CN',
    fields: {
      'fullName': {
        validators: {
          notEmpty: {}
        }
      },
      'mobilePhone': {
        validators: {
          notEmpty: {},
          phone: {
            message: '请输入完整的十一位电话(如：02133967872，18122339791)',
            country: 'CN'
          }
        }
      },
    }
  }).on('success.form.fv', function (e) {
  });
};