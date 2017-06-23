/**
 * Created by Feddiyao on 2017/5/15.
 */
$(document).ready(function () {
  var hospitalModal = new HospitalModal();

  var $searchProvince = $('#provinceId_search');
  var $searchCity = $('#cityId_search');
  var $searchDistrict = $('#districtId_search');

  var currentProvinceId = $("#currentProvinceId").val();
  var currentCityId = $("#currentCityId").val();
  var currentDistrictId = $("#currentDistrictId").val();

  if (status === 'dynamic') {
    getProvinces($searchProvince, $searchCity, $searchDistrict, function () {
      //选择搜索条件中的省市区
      if (null != currentProvinceId && undefined != currentProvinceId) {
        $searchProvince.val(currentProvinceId);
        if (null != currentCityId && undefined != currentCityId) {
          resetOptions($searchCity);
          getCityByProvinceIds($searchProvince.val(), $searchCity, $searchDistrict, "string", function () {
            $searchCity.val(currentCityId);
            if (null != currentDistrictId && undefined != currentDistrictId) {
              resetOptions($searchDistrict);
              getDistrictByCityIds($searchCity.val(), $searchDistrict, "string", function () {
                $searchDistrict.val(currentDistrictId);
              });
            }
          });
        }
      }
    });

    $searchProvince.change(function () {
      getCityByProvinceIds($searchProvince.val(), $searchCity, $searchDistrict);
    });

    $searchCity.change(function () {
      getDistrictByCityIds($searchCity.val(), $searchDistrict);
    });
  }

  hospitalModal.departmentFormValidation($('#createDepartmentForm'));
});

var HospitalModal = new Function();

HospitalModal.prototype.departmentFormValidation = function ($form) {
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
          email: {
            message: '请输入完整的邮箱地址',
            country: 'CN'
          }
        }
      },
    }
  }).on('success.form.fv', function (e) {
    e.preventDefault();
    var data = $(this).serialize();
    $.ajax({
      type: "post",
      data: data,
      url: ctxPath + "be/hospital/save",
      success: function (resp) {
        window.location.href = ctxPath + "be/hospital/index";
      },
      complete: function () {
        var $submit = $form.find("input:submit");
        $submit.removeAttr("disabled");
        $submit.removeClass("disabled");
      }
    });
  });
};