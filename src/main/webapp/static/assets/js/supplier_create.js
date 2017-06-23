/**
 * Created by FelixZuo on 2017/5/17.
 */
var $form = $('#supplierCreateForm');

$(document).ready(function () {
  // 地区联动选择
  var $province = $("#provinceId_create");
  var $city = $("#cityId_create");
  var $district = $("#districtId_create");

  getProvinces($province, $city, $district);

  $province.change(function () {
    resetOptions($city);
    getCityByProvinceIds($province.val(), $city, $district);
  });

  $city.change(function () {
    resetOptions($district);
    getDistrictByCityIds($city.val(), $district);
  });

  //多选框组件
  multiSelectRender($('#supplierType_create'));

  //表单前端验证
  var supplierCreate = new SupplierCreate();
  supplierCreate.supplierCreateFormValidation($form)

});

var SupplierCreate = new Function();

SupplierCreate.prototype.supplierCreateFormValidation = function ($form) {
  $form.formValidation({
    framework: 'bootstrap',
    excluded: ':disabled',
    locale: 'zh_CN',
    fields: {
      'name': {
        validators: {
          notEmpty: {}
        }
      },
      'supplierType': {
        validators: {
          notEmpty: {}
        }
      },
      'provinceId': {
        validators: {
          notEmpty: {}
        }
      },
      'cityId': {
        validators: {
          notEmpty: {}
        }
      },
      'districtId': {
        validators: {
          notEmpty: {}
        }
      },
      'contactPhone': {
        validators: {
          phone: {
            message: '请输入完整的十一位电话(如：02133967872，18122339791',
            country: 'CN'
          }
        }
      },
      'contactEmail': {
        validators: {
          emailAddress: {
            message: '请输入有效的邮箱'
          }
        }
      }
    }
  }).on('success.form.fv', function (e) {
    e.preventDefault();
    var data = $form.serialize();
    $.ajax({
      type: "post",
      data: data,
      url: "/pms/be/supplier/save",
      success: function (resp) {
        window.location.href = ctxPath + "be/supplier/index";
      },
      complete: function () {
        $submit = $form.find("input:submit");
        $submit.removeAttr("disabled");
        $submit.removeClass("disabled");
      }
    });
  });

}