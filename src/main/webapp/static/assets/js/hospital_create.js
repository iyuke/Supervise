/**
 * Created by Feddiyao on 2017/5/10.
 */
var $form = $('#name_create').closest('form');

$(document).ready(function () {
  var $province = $("#provinceId_create");
  var $city = $("#cityId_create");
  var $district = $("#districtId_create");

  var hospitalUpdate = new HospitalUpdate();

  //是否与第三方合作动态变化
  $('.hasThirdParty').change(function () {
    var hasThirdPartyVal = $('.hasThirdParty:checked').val();
    if (hasThirdPartyVal === 'true') {
      $('.hasThirdPartyCollapse').show();
    } else {
      $('.hasThirdPartyCollapse').hide();
    }
  });

  getProvinces($province, $city, $district);

  $province.change(function () {
    resetOptions($city);
    getCityByProvinceIds($province.val(), $city, $district);
  });

  $city.change(function () {
    resetOptions($district);
    getDistrictByCityIds($city.val(), $district);
  });
  //表单前端验证
  hospitalUpdate.hospitalUpdateFormValidation($form)

});

var HospitalUpdate = new Function();

HospitalUpdate.prototype.hospitalUpdateFormValidation = function ($form) {
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
          notEmpty: {},
        }
      },
      'directorPhone_create': {
        validators: {
          phone: {
            message: '请输入完整的十一位电话(如：02133967872，18122339791',
            country: 'CN'
          }
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
      'amountOfResidentPopulation': {
        validators: {
          numeric: {
            message: '请输入有效的数字',
          }
        }
      },
      'amountOfOutpatients': {
        validators: {
          numeric: {
            message: '请输入有效的数字',
          }
        }
      },
      'amountOfSurgeries': {
        validators: {
          numeric: {
            message: '请输入有效的数字',
          }
        }
      },
      'amountOfBeds': {
        validators: {
          numeric: {
            message: '请输入有效的数字',
          }
        }
      },
      'amountOfRoutinePathology': {
        validators: {
          numeric: {
            message: '请输入有效的数字',
          }
        }
      },
      'amountOfTCT': {
        validators: {
          numeric: {
            message: '请输入有效的数字',
          }
        }
      },
      'amountOfHPV': {
        validators: {
          numeric: {
            message: '请输入有效的数字',
          }
        }
      },
      'amountOfIHC': {
        validators: {
          numeric: {
            message: '请输入有效的数字',
          }
        }
      },
      'amountOfConsultation': {
        validators: {
          numeric: {
            message: '请输入有效的数字',
          }
        }
      },
      'amountOfFrozenAndParaffin': {
        validators: {
          numeric: {
            message: '请输入有效的数字',
          }
        }
      },
      'amountOfTreatment': {
        validators: {
          numeric: {
            message: '请输入有效的数字',
          }
        }
      },
      'amountOfDischarged': {
        validators: {
          numeric: {
            message: '请输入有效的数字',
          }
        }
      },
      'amountOfMolecule': {
        validators: {
          numeric: {
            message: '请输入有效的数字',
          }
        }
      },
      'amountOfOutgoing': {
        validators: {
          numeric: {
            message: '请输入有效的数字',
          }
        }
      }
    }
  }).on('success.form.fv', function (e) {
    e.preventDefault();
    var data = $form.serialize();
    layer.confirm('新建医院后，编码不可再修改，请确定是否继续保存？', {
      btn: ['确定', '取消'] //按钮
    }, function () {
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
  });

}