/**
 * Created by Feddiyao on 2017/5/5.
 */
var $form = $("#fullName").closest("form");
$(document).ready(function () {
var salesman = new Salesman();
  $('.selectpicker').selectpicker();
  salesman.formValidation($form);
});

var Salesman = new Function();
Salesman.prototype.formValidation = function ($form) {
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